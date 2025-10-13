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
exports.EndpointController = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../constants");
const policy_guard_1 = require("../policy/policy.guard");
const rule_decorator_1 = require("../policy/decorators/rule.decorator");
const handler_service_1 = require("../handler/handler.service");
let EndpointController = class EndpointController {
    constructor(handlerService) {
        this.handlerService = handlerService;
    }
    triggerGetEndpoint(req, res) {
        return this.handleRoute(req, res);
    }
    triggerPostEndpoint(req, res) {
        return this.handleRoute(req, res);
    }
    triggerPutEndpoint(req, res) {
        return this.handleRoute(req, res);
    }
    triggerPatchEndpoint(req, res) {
        return this.handleRoute(req, res);
    }
    triggerDeleteEndpoint(req, res) {
        return this.handleRoute(req, res);
    }
    async handleRoute(req, res) {
        if (!req['endpoint']) {
            throw new common_1.HttpException('Route not found', 404);
        }
        req['params'] = req['dynamicParams'];
        return this.handlerService.trigger({
            path: req['endpoint'].handler,
            req,
            res
        });
    }
};
exports.EndpointController = EndpointController;
__decorate([
    (0, common_1.Get)('*'),
    (0, rule_decorator_1.Rule)('dynamic-endpoint'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "triggerGetEndpoint", null);
__decorate([
    (0, common_1.Post)('*'),
    (0, rule_decorator_1.Rule)('dynamic-endpoint'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "triggerPostEndpoint", null);
__decorate([
    (0, common_1.Put)('*'),
    (0, rule_decorator_1.Rule)('dynamic-endpoint'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "triggerPutEndpoint", null);
__decorate([
    (0, common_1.Patch)('*'),
    (0, rule_decorator_1.Rule)('dynamic-endpoint'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "triggerPatchEndpoint", null);
__decorate([
    (0, common_1.Delete)('*'),
    (0, rule_decorator_1.Rule)('dynamic-endpoint'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EndpointController.prototype, "triggerDeleteEndpoint", null);
exports.EndpointController = EndpointController = __decorate([
    (0, common_1.UseGuards)(policy_guard_1.PolicyGuard),
    (0, common_1.Controller)(constants_1.ENDPOINTS_PATH),
    __metadata("design:paramtypes", [handler_service_1.HandlerService])
], EndpointController);
