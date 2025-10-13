"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestModule = void 0;
const common_1 = require("@nestjs/common");
const entity_module_1 = require("../entity/entity.module");
const manifest_controller_1 = require("./controllers/manifest.controller");
const schema_service_1 = require("./services/schema.service");
const yaml_service_1 = require("./services/yaml.service");
const auth_module_1 = require("../auth/auth.module");
const entity_manifest_service_1 = require("./services/entity-manifest.service");
const relationship_manifest_service_1 = require("./services/relationship-manifest.service");
const manifest_service_1 = require("./services/manifest.service");
const hook_module_1 = require("../hook/hook.module");
const policy_module_1 = require("../policy/policy.module");
const endpoint_module_1 = require("../endpoint/endpoint.module");
const property_manifest_service_1 = require("./services/property-manifest.service");
const lock_file_service_1 = require("./services/lock-file.service");
const match_entity_middleware_1 = require("../middleware/match-entity.middleware");
let ManifestModule = class ManifestModule {
    configure(consumer) {
        consumer.apply(match_entity_middleware_1.MatchEntityMiddleware).forRoutes(manifest_controller_1.ManifestController);
    }
};
exports.ManifestModule = ManifestModule;
exports.ManifestModule = ManifestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => entity_module_1.EntityModule),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            (0, common_1.forwardRef)(() => endpoint_module_1.EndpointModule),
            hook_module_1.HookModule,
            policy_module_1.PolicyModule
        ],
        providers: [
            manifest_service_1.ManifestService,
            yaml_service_1.YamlService,
            schema_service_1.SchemaService,
            entity_manifest_service_1.EntityManifestService,
            property_manifest_service_1.PropertyManifestService,
            relationship_manifest_service_1.RelationshipManifestService,
            lock_file_service_1.LockFileService
        ],
        controllers: [manifest_controller_1.ManifestController],
        exports: [manifest_service_1.ManifestService, entity_manifest_service_1.EntityManifestService, relationship_manifest_service_1.RelationshipManifestService]
    })
], ManifestModule);
