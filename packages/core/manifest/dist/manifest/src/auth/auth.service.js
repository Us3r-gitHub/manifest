"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jwt = __importStar(require("jsonwebtoken"));
const entity_service_1 = require("../entity/services/entity.service");
const constants_1 = require("../constants");
const entity_manifest_service_1 = require("../manifest/services/entity-manifest.service");
const crud_service_1 = require("../crud/services/crud.service");
let AuthService = class AuthService {
    constructor(configService, entityService, entityManifestService, crudService) {
        this.configService = configService;
        this.entityService = entityService;
        this.entityManifestService = entityManifestService;
        this.crudService = crudService;
    }
    includeTenantId(entitySlug) {
        return (this.configService.get('shouldPrefixTable') &&
            entitySlug === constants_1.ADMIN_ENTITY_MANIFEST.slug);
    }
    async createToken(entitySlug, signupUserDto) {
        const entityManifest = this.entityManifestService.getEntityManifest({
            slug: entitySlug
        });
        if (!entityManifest.authenticable) {
            throw new common_1.HttpException('Entity is not authenticable', common_1.HttpStatus.BAD_REQUEST);
        }
        const { email, password, tenantId } = signupUserDto;
        const user = await this.findUserFromCredentials(entitySlug, email, password, this.includeTenantId(entitySlug) ? tenantId : undefined);
        if (!user) {
            throw new common_1.HttpException('Invalid email or password', common_1.HttpStatus.UNAUTHORIZED);
        }
        return {
            token: jwt.sign({ email, entitySlug, tenantId }, this.configService.get('tokenSecretKey'))
        };
    }
    async signup(entitySlug, signupUserDto, byPassAdminCheck) {
        if (entitySlug === constants_1.ADMIN_ENTITY_MANIFEST.slug && !byPassAdminCheck) {
            throw new common_1.HttpException('Admins cannot be created with this method.', common_1.HttpStatus.BAD_REQUEST);
        }
        const entityManifest = this.entityManifestService.getEntityManifest({
            slug: entitySlug
        });
        if (!entityManifest.authenticable) {
            throw new common_1.HttpException('Entity is not authenticable', common_1.HttpStatus.BAD_REQUEST);
        }
        const userDto = signupUserDto;
        if (this.includeTenantId(entitySlug))
            userDto['tenantId'] = signupUserDto.tenantId;
        const savedUser = (await this.crudService.store(entitySlug, userDto));
        return this.createToken(entitySlug, savedUser);
    }
    async getUserFromToken(token) {
        let decoded;
        try {
            decoded = jwt.verify(token?.replace('Bearer ', ''), this.configService.get('tokenSecretKey'));
        }
        catch {
            return Promise.resolve({ user: null, entitySlug: null });
        }
        if (!decoded) {
            return Promise.resolve({ user: null, entitySlug: null });
        }
        const { email, entitySlug, tenantId } = decoded;
        const entityRepository = this.entityService.getEntityRepository({
            entitySlug
        });
        const whereClause = this.includeTenantId(entitySlug) && tenantId
            ? { email, tenantId }
            : { email };
        const user = await entityRepository.findOne({
            where: whereClause
        });
        delete user.password;
        return { user, entitySlug };
    }
    getUserFromRequest(req) {
        const token = req.headers?.['authorization'];
        if (!token) {
            return Promise.resolve({ user: null, entitySlug: null });
        }
        return this.getUserFromToken(token);
    }
    async isReqUserAdmin(req) {
        return this.getUserFromRequest(req).then((res) => !!res?.user && res?.entitySlug === constants_1.ADMIN_ENTITY_MANIFEST.slug);
    }
    async isDefaultAdminExists(tenantId) {
        const admin = await this.findUserFromCredentials(constants_1.ADMIN_ENTITY_MANIFEST.slug, constants_1.DEFAULT_ADMIN_CREDENTIALS.email, constants_1.DEFAULT_ADMIN_CREDENTIALS.password, this.includeTenantId(constants_1.ADMIN_ENTITY_MANIFEST.slug) ? tenantId : undefined);
        return { exists: !!admin };
    }
    async findUserFromCredentials(entitySlug, email, password, tenantId) {
        const entityRepository = this.entityService.getEntityRepository({
            entitySlug
        });
        const whereClause = tenantId ? { email, tenantId } : { email };
        const user = await entityRepository.findOne({
            where: whereClause
        });
        if (!user || !bcryptjs_1.default.compareSync(password, user.password)) {
            return null;
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        entity_service_1.EntityService,
        entity_manifest_service_1.EntityManifestService,
        crud_service_1.CrudService])
], AuthService);
