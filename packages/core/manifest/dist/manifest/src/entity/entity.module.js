"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityModule = void 0;
const common_1 = require("@nestjs/common");
const manifest_module_1 = require("../manifest/manifest.module");
const entity_loader_service_1 = require("./services/entity-loader.service");
const entity_service_1 = require("./services/entity.service");
const relationship_service_1 = require("./services/relationship.service");
const auth_module_1 = require("../auth/auth.module");
const column_service_1 = require("./services/column.service");
const entity_type_service_1 = require("./services/entity-type.service");
let EntityModule = class EntityModule {
};
exports.EntityModule = EntityModule;
exports.EntityModule = EntityModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => manifest_module_1.ManifestModule), (0, common_1.forwardRef)(() => auth_module_1.AuthModule)],
        providers: [
            entity_loader_service_1.EntityLoaderService,
            entity_type_service_1.EntityTypeService,
            entity_service_1.EntityService,
            relationship_service_1.RelationshipService,
            column_service_1.ColumnService
        ],
        exports: [entity_loader_service_1.EntityLoaderService, entity_service_1.EntityService, relationship_service_1.RelationshipService]
    })
], EntityModule);
