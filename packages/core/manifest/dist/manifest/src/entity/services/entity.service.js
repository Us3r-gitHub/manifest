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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const entity_manifest_service_1 = require("../../manifest/services/entity-manifest.service");
let EntityService = class EntityService {
    constructor(dataSource, entityManifestService) {
        this.dataSource = dataSource;
        this.entityManifestService = entityManifestService;
    }
    getEntityMetadatas() {
        return this.sortEntitiesByHierarchy(this.dataSource.entityMetadatas);
    }
    getEntityMetadata({ className, slug }) {
        if (!className && !slug) {
            throw new Error('Either className or slug must be provided');
        }
        if (slug) {
            className = this.entityManifestService.getEntityManifest({
                slug,
                fullVersion: true,
                includeNested: true
            }).className;
        }
        const entityMetadata = this.dataSource.entityMetadatas.find((entity) => entity.targetName === className);
        if (!entityMetadata) {
            throw new Error(`Entity ${className} not found`);
        }
        return entityMetadata;
    }
    sortEntitiesByHierarchy(entities) {
        const orderedEntities = [];
        entities.forEach((entity) => {
            const parentRelationColumns = entity.columns.filter((column) => column.relationMetadata?.relationType === 'many-to-one');
            if (!parentRelationColumns.length && !orderedEntities.includes(entity)) {
                orderedEntities.push(entity);
            }
            else {
                parentRelationColumns.forEach((relationColumn) => {
                    const parentEntity = relationColumn.relationMetadata.inverseEntityMetadata;
                    if (!orderedEntities.includes(parentEntity)) {
                        const entityIndex = orderedEntities.indexOf(entity) || 0;
                        orderedEntities.splice(entityIndex, 0, parentEntity);
                    }
                    if (!orderedEntities.includes(entity)) {
                        orderedEntities.push(entity);
                    }
                });
            }
        });
        return orderedEntities;
    }
    getEntityRepository({ entityMetadata, entitySlug }) {
        if (!entityMetadata && !entitySlug) {
            throw new Error('Either entityMetadata or entitySlug must be provided');
        }
        if (entitySlug) {
            entityMetadata = this.getEntityMetadata({ slug: entitySlug });
        }
        return this.dataSource.getRepository(entityMetadata.target);
    }
};
exports.EntityService = EntityService;
exports.EntityService = EntityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        entity_manifest_service_1.EntityManifestService])
], EntityService);
