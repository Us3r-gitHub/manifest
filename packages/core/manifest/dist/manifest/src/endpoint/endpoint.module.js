"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndpointModule = void 0;
const common_1 = require("@nestjs/common");
const endpoint_service_1 = require("./endpoint.service");
const endpoint_controller_1 = require("./endpoint.controller");
const match_endpoint_middleware_1 = require("./middlewares/match-endpoint.middleware");
const manifest_module_1 = require("../manifest/manifest.module");
const auth_module_1 = require("../auth/auth.module");
const policy_module_1 = require("../policy/policy.module");
const handler_module_1 = require("../handler/handler.module");
const entity_module_1 = require("../entity/entity.module");
let EndpointModule = class EndpointModule {
    configure(consumer) {
        consumer.apply(match_endpoint_middleware_1.MatchEndpointMiddleware).forRoutes(endpoint_controller_1.EndpointController);
    }
};
exports.EndpointModule = EndpointModule;
exports.EndpointModule = EndpointModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => manifest_module_1.ManifestModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => entity_module_1.EntityModule),
            policy_module_1.PolicyModule,
            handler_module_1.HandlerModule
        ],
        providers: [endpoint_service_1.EndpointService],
        controllers: [endpoint_controller_1.EndpointController],
        exports: [endpoint_service_1.EndpointService]
    })
], EndpointModule);
