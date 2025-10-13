"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const entity_module_1 = require("../entity/entity.module");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const manifest_module_1 = require("../manifest/manifest.module");
const database_service_1 = require("../crud/services/database.service");
const crud_module_1 = require("../crud/crud.module");
const match_entity_middleware_1 = require("../middleware/match-entity.middleware");
let AuthModule = class AuthModule {
    configure(consumer) {
        consumer.apply(match_entity_middleware_1.MatchEntityMiddleware).forRoutes(auth_controller_1.AuthController);
    }
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => entity_module_1.EntityModule),
            (0, common_1.forwardRef)(() => manifest_module_1.ManifestModule),
            crud_module_1.CrudModule
        ],
        controllers: [auth_controller_1.AuthController],
        providers: [auth_service_1.AuthService, database_service_1.DatabaseService],
        exports: [auth_service_1.AuthService]
    })
], AuthModule);
