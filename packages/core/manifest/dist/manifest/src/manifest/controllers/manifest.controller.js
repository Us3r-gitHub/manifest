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
exports.ManifestController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("../../auth/auth.service");
const manifest_service_1 = require("../services/manifest.service");
const is_admin_guard_1 = require("../../auth/guards/is-admin.guard");
const entity_manifest_service_1 = require("../services/entity-manifest.service");
const normalize_entities_utils_1 = require("../../entity/utils/normalize-entities.utils");
let ManifestController = class ManifestController {
    constructor(manifestService, entityManifestService, authService) {
        this.manifestService = manifestService;
        this.entityManifestService = entityManifestService;
        this.authService = authService;
    }
    async getAppName() {
        const manifest = this.manifestService.getAppManifest();
        return { name: manifest.name };
    }
    async getAppManifest(tenantId) {
        const appManifest = this.manifestService.getAppManifest({
            fullVersion: true
        });
        const entities = (0, normalize_entities_utils_1.normalizeEntities)(appManifest.entities, tenantId);
        return { ...appManifest, entities };
    }
    async getEntityManifest(entitySlug, req) {
        const isAdmin = await this.authService.isReqUserAdmin(req);
        return this.entityManifestService.getEntityManifest({
            slug: req['entityTenant'] || entitySlug,
            fullVersion: isAdmin
        });
    }
};
exports.ManifestController = ManifestController;
__decorate([
    (0, common_1.Get)('app-name'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ManifestController.prototype, "getAppName", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    __param(0, (0, common_1.Param)('tenantId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManifestController.prototype, "getAppManifest", null);
__decorate([
    (0, common_1.Get)('entities/:entitySlug'),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    __param(0, (0, common_1.Param)('entitySlug')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ManifestController.prototype, "getEntityManifest", null);
exports.ManifestController = ManifestController = __decorate([
    (0, common_1.Controller)('manifest'),
    __metadata("design:paramtypes", [manifest_service_1.ManifestService,
        entity_manifest_service_1.EntityManifestService,
        auth_service_1.AuthService])
], ManifestController);
