"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const signup_authenticable_entity_dto_1 = require("./dtos/signup-authenticable-entity.dto");
const rule_decorator_1 = require("../policy/decorators/rule.decorator");
const policy_guard_1 = require("../policy/policy.guard");
const is_db_empty_guard_1 = require("./guards/is-db-empty.guard");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async getToken(tenantId, entitySlug, signupUserDto, req) {
        return this.authService.createToken(req['entityTenant'] || entitySlug, {
            ...signupUserDto,
            tenantId
        });
    }
    async signupAdmin(tenantId, signupUserDto) {
        return this.authService.signup('admins', { ...signupUserDto, tenantId }, true);
    }
    async signup(tenantId, entitySlug, signupUserDto, req) {
        return this.authService.signup(req['entityTenant'] || entitySlug, {
            ...signupUserDto,
            tenantId
        });
    }
    async getCurrentUser(req) {
        return (await this.authService.getUserFromRequest(req)).user;
    }
    async isDefaultAdminExists(tenantId) {
        return this.authService.isDefaultAdminExists(tenantId);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)(':entitySlug/login'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('entitySlug')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, signup_authenticable_entity_dto_1.SignupAuthenticableEntityDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getToken", null);
__decorate([
    (0, common_1.UseGuards)(is_db_empty_guard_1.IsDbEmptyGuard),
    (0, common_1.Post)('admins/signup'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, signup_authenticable_entity_dto_1.SignupAuthenticableEntityDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signupAdmin", null);
__decorate([
    (0, rule_decorator_1.Rule)('signup'),
    (0, common_1.Post)(':entitySlug/signup'),
    __param(0, (0, common_1.Param)('tenantId')),
    __param(1, (0, common_1.Param)('entitySlug')),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, signup_authenticable_entity_dto_1.SignupAuthenticableEntityDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "signup", null);
__decorate([
    (0, common_1.Get)(':entitySlug/me'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCurrentUser", null);
__decorate([
    (0, common_1.Get)('admins/default-exists'),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "isDefaultAdminExists", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.UseGuards)(policy_guard_1.PolicyGuard),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
