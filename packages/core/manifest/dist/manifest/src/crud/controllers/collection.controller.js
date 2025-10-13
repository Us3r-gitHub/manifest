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
exports.CollectionController = void 0;
const common_1 = require("@nestjs/common");
const crud_service_1 = require("../services/crud.service");
const auth_service_1 = require("../../auth/auth.service");
const policy_guard_1 = require("../../policy/policy.guard");
const rule_decorator_1 = require("../../policy/decorators/rule.decorator");
const is_collection_guard_1 = require("../guards/is-collection.guard");
const hook_interceptor_1 = require("../../hook/hook.interceptor");
const constants_1 = require("../../constants");
const middleware_interceptor_1 = require("../../middleware/middleware.interceptor");
const is_admin_guard_1 = require("../../auth/guards/is-admin.guard");
let CollectionController = class CollectionController {
    constructor(crudService, authService) {
        this.crudService = crudService;
        this.authService = authService;
    }
    async findAll(entitySlug, queryParams, req) {
        const isAdmin = await this.authService.isReqUserAdmin(req);
        return this.crudService.findAll({
            entitySlug: req['entityTenant'] || entitySlug,
            queryParams,
            fullVersion: isAdmin
        });
    }
    findSelectOptions(entitySlug, queryParams, req) {
        return this.crudService.findSelectOptions({
            entitySlug: req['entityTenant'] || entitySlug,
            queryParams
        });
    }
    async findOne(entitySlug, id, queryParams, req) {
        const isAdmin = await this.authService.isReqUserAdmin(req);
        return this.crudService.findOne({
            entitySlug: req['entityTenant'] || entitySlug,
            id,
            queryParams,
            fullVersion: isAdmin
        });
    }
    store(entitySlug, entityDto, req) {
        return this.crudService.store(req['entityTenant'] || entitySlug, entityDto);
    }
    put(entitySlug, id, itemDto, req) {
        return this.crudService.update({
            entitySlug: req['entityTenant'] || entitySlug,
            id,
            itemDto
        });
    }
    patch(entitySlug, id, itemDto, req) {
        return this.crudService.update({
            entitySlug: req['entityTenant'] || entitySlug,
            id,
            itemDto,
            partialReplacement: true
        });
    }
    delete(entitySlug, id, req) {
        return this.crudService.delete(req['entityTenant'] || entitySlug, id);
    }
};
exports.CollectionController = CollectionController;
__decorate([
    (0, rule_decorator_1.Rule)('read'),
    (0, common_1.Get)('/:entitySlug'),
    __param(0, (0, common_1.Param)('entitySlug')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Get)(':entitySlug/select-options'),
    __param(0, (0, common_1.Param)('entitySlug')),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "findSelectOptions", null);
__decorate([
    (0, rule_decorator_1.Rule)('read'),
    (0, common_1.Get)(':entitySlug/:id'),
    __param(0, (0, common_1.Param)('entitySlug')),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "findOne", null);
__decorate([
    (0, rule_decorator_1.Rule)('create'),
    (0, common_1.Post)(':entitySlug'),
    __param(0, (0, common_1.Param)('entitySlug')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "store", null);
__decorate([
    (0, rule_decorator_1.Rule)('update'),
    (0, common_1.Put)(':entitySlug/:id'),
    __param(0, (0, common_1.Param)('entitySlug')),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "put", null);
__decorate([
    (0, rule_decorator_1.Rule)('update'),
    (0, common_1.Patch)(':entitySlug/:id'),
    __param(0, (0, common_1.Param)('entitySlug')),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Body)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "patch", null);
__decorate([
    (0, rule_decorator_1.Rule)('delete'),
    (0, common_1.Delete)(':entitySlug/:id'),
    __param(0, (0, common_1.Param)('entitySlug')),
    __param(1, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CollectionController.prototype, "delete", null);
exports.CollectionController = CollectionController = __decorate([
    (0, common_1.UseGuards)(policy_guard_1.PolicyGuard, is_collection_guard_1.IsCollectionGuard),
    (0, common_1.UseInterceptors)(hook_interceptor_1.HookInterceptor, middleware_interceptor_1.MiddlewareInterceptor),
    (0, common_1.Controller)(constants_1.COLLECTIONS_PATH),
    __metadata("design:paramtypes", [crud_service_1.CrudService,
        auth_service_1.AuthService])
], CollectionController);
