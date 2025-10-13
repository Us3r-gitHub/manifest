"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudModule = void 0;
const common_1 = require("@nestjs/common");
const entity_module_1 = require("../entity/entity.module");
const manifest_module_1 = require("../manifest/manifest.module");
const crud_service_1 = require("./services/crud.service");
const pagination_service_1 = require("./services/pagination.service");
const validation_module_1 = require("../validation/validation.module");
const database_service_1 = require("./services/database.service");
const database_controller_1 = require("./controllers/database.controller");
const collection_controller_1 = require("./controllers/collection.controller");
const single_controller_1 = require("./controllers/single.controller");
const hook_module_1 = require("../hook/hook.module");
const auth_module_1 = require("../auth/auth.module");
const middleware_module_1 = require("../middleware/middleware.module");
const match_entity_middleware_1 = require("../middleware/match-entity.middleware");
let CrudModule = class CrudModule {
    configure(consumer) {
        consumer
            .apply(match_entity_middleware_1.MatchEntityMiddleware)
            .forRoutes(collection_controller_1.CollectionController, single_controller_1.SingleController);
    }
};
exports.CrudModule = CrudModule;
exports.CrudModule = CrudModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => entity_module_1.EntityModule),
            (0, common_1.forwardRef)(() => manifest_module_1.ManifestModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            validation_module_1.ValidationModule,
            hook_module_1.HookModule,
            middleware_module_1.MiddlewareModule
        ],
        controllers: [collection_controller_1.CollectionController, database_controller_1.DatabaseController, single_controller_1.SingleController],
        providers: [crud_service_1.CrudService, pagination_service_1.PaginationService, database_service_1.DatabaseService],
        exports: [database_service_1.DatabaseService, crud_service_1.CrudService]
    })
], CrudModule);
