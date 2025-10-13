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
exports.SingleController = void 0;
const common_1 = require("@nestjs/common");
const rule_decorator_1 = require("../../policy/decorators/rule.decorator");
const auth_service_1 = require("../../auth/auth.service");
const crud_service_1 = require("../services/crud.service");
const is_single_guard_1 = require("../guards/is-single.guard");
const policy_guard_1 = require("../../policy/policy.guard");
const hook_interceptor_1 = require("../../hook/hook.interceptor");
const constants_1 = require("../../constants");
const middleware_interceptor_1 = require("../../middleware/middleware.interceptor");
let SingleController = class SingleController {
    constructor(authService, crudService) {
        this.authService = authService;
        this.crudService = crudService;
    }
    async findOne(entitySlug, req) {
        const isAdmin = await this.authService.isReqUserAdmin(req);
        let singleItem;
        const slug = req['entityTenant'] || entitySlug;
        try {
            singleItem = await this.crudService.findOne({
                entitySlug: slug,
                fullVersion: isAdmin
            });
        }
        catch (e) {
            if (e instanceof common_1.NotFoundException) {
                singleItem = await this.crudService.storeEmpty(entitySlug);
            }
        }
        return singleItem;
    }
    put(entitySlug, itemDto, req) {
        return this.crudService.update({
            entitySlug: req['entityTenant'] || entitySlug,
            itemDto
        });
    }
    patch(entitySlug, itemDto, req) {
        return this.crudService.update({
            entitySlug: req['entityTenant'] || entitySlug,
            itemDto,
            partialReplacement: true
        });
    }
};
exports.SingleController = SingleController;
__decorate([
    (0, common_1.Get)(':entitySlug'),
    (0, rule_decorator_1.Rule)('read'),
    __param(0, (0, common_1.Param)('entitySlug')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SingleController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':entitySlug'),
    (0, rule_decorator_1.Rule)('update'),
    __param(0, (0, common_1.Param)('entitySlug')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SingleController.prototype, "put", null);
__decorate([
    (0, common_1.Patch)(':entitySlug'),
    (0, rule_decorator_1.Rule)('update'),
    __param(0, (0, common_1.Param)('entitySlug')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], SingleController.prototype, "patch", null);
exports.SingleController = SingleController = __decorate([
    (0, common_1.UseGuards)(policy_guard_1.PolicyGuard, is_single_guard_1.IsSingleGuard),
    (0, common_1.UseInterceptors)(hook_interceptor_1.HookInterceptor, middleware_interceptor_1.MiddlewareInterceptor),
    (0, common_1.Controller)(constants_1.SINGLES_PATH),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        crud_service_1.CrudService])
], SingleController);
