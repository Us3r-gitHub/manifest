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
exports.EntityTypeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const manifest_service_1 = require("../../manifest/services/manifest.service");
const src_1 = require("../../../../types/src");
const prop_type_ts_type_1 = require("../types/prop-type-ts-type");
const constants_1 = require("../../constants");
const src_2 = require("../../../../common/src");
const normalize_entities_utils_1 = require("../utils/normalize-entities.utils");
let EntityTypeService = class EntityTypeService {
    constructor(configService, manifestService) {
        this.configService = configService;
        this.manifestService = manifestService;
    }
    generateEntityTypeInfos() {
        const appManifest = this.manifestService.getAppManifest({
            fullVersion: true
        });
        const manifestId = this.manifestService.getManifestId();
        const entityTsTypeInfos = [];
        const entities = (0, normalize_entities_utils_1.normalizeEntities)(appManifest.entities, manifestId);
        Object.values(entities).map((entity) => entityTsTypeInfos.push(this.generateEntityTypeInfoFromManifest(entity)));
        Object.values(entities)
            .filter((entity) => !entity.nested)
            .map((entity) => entityTsTypeInfos.push(this.generateCreateDtoTypeInfoFromManifest(entity)));
        return entityTsTypeInfos;
    }
    generateEntityTypeInfoFromManifest(entityManifest) {
        const properties = [
            {
                name: 'id',
                type: src_1.PropType.String
            }
        ];
        if (entityManifest.authenticable) {
            properties.push(...constants_1.AUTHENTICABLE_PROPS);
        }
        const propertyTypeInfos = [
            ...properties,
            ...entityManifest.properties
        ].map((prop) => {
            const propertyTsTypeInfo = {
                name: prop.name,
                type: prop_type_ts_type_1.propTypeTsType[prop.type] || 'any',
                manifestPropType: prop.type
            };
            if (prop.type === src_1.PropType.Choice) {
                propertyTsTypeInfo.values = prop.options?.values || null;
            }
            else if (prop.type === src_1.PropType.Image) {
                propertyTsTypeInfo.type = Object.keys(prop.options?.sizes || {}).reduce((acc, size) => {
                    acc[size] = {
                        width: prop.options?.sizes[size].width || 0,
                        height: prop.options?.sizes[size].height || 0
                    };
                    return acc;
                }, {});
                propertyTsTypeInfo.sizes = prop.options?.sizes;
            }
            return propertyTsTypeInfo;
        });
        if (!entityManifest.nested) {
            entityManifest.relationships.forEach((relationship) => {
                if (relationship.type === 'many-to-many' ||
                    relationship.type === 'one-to-many') {
                    propertyTypeInfos.push({
                        name: relationship.name,
                        type: `${relationship.entity}[]`,
                        isRelationship: true,
                        optional: true
                    });
                }
                else {
                    propertyTypeInfos.push({
                        name: relationship.name,
                        type: relationship.entity,
                        isRelationship: true,
                        optional: true
                    });
                }
            });
        }
        return {
            name: entityManifest.className,
            properties: propertyTypeInfos,
            nested: entityManifest.nested
        };
    }
    generateCreateDtoTypeInfoFromManifest(entityManifest) {
        const properties = [];
        if (entityManifest.authenticable) {
            properties.push(...constants_1.AUTHENTICABLE_PROPS);
        }
        const propertyTypeInfos = [
            ...properties,
            ...entityManifest.properties
        ].map((prop) => {
            const propertyTsTypeInfo = {
                name: prop.name,
                type: prop_type_ts_type_1.propTypeTsType[prop.type] || 'any',
                manifestPropType: prop.type
            };
            if (prop.type === src_1.PropType.Choice) {
                propertyTsTypeInfo.values = prop.options?.values || null;
            }
            else if (prop.type === src_1.PropType.Image) {
                propertyTsTypeInfo.sizes = prop.options?.sizes;
            }
            return propertyTsTypeInfo;
        });
        entityManifest.relationships.forEach((relationship) => {
            if (relationship.type === 'one-to-many' && !relationship.nested) {
                return;
            }
            const dtoPropertyName = (0, src_2.getDtoPropertyNameFromRelationship)(relationship);
            const isMultiple = relationship.type === 'many-to-many' ||
                relationship.type === 'one-to-many';
            const type = relationship.nested
                ? relationship.entity
                : `string`;
            propertyTypeInfos.push({
                name: dtoPropertyName,
                type: isMultiple ? `${type}[]` : type,
                isRelationship: true,
                optional: true
            });
        });
        return {
            name: `CreateUpdate${entityManifest.className}Dto`,
            properties: propertyTypeInfos
        };
    }
    generateTSInterfaceFromEntityTypeInfo(entityTypeInfo) {
        const tsProperties = entityTypeInfo.properties.map((prop) => {
            let tsType;
            if (prop.manifestPropType === src_1.PropType.Image && prop.sizes) {
                tsType = `{ ${Object.keys(prop.sizes)
                    .map((size) => `${size}: string`)
                    .join('; ')} }`;
            }
            else if (prop.manifestPropType === src_1.PropType.Location) {
                tsType = '{ lat: number; lng: number; }';
            }
            else {
                tsType = prop.type;
            }
            if (prop.values) {
                tsType = prop.values.map((val) => `'${val}'`).join(' | ');
            }
            return `  ${prop.name}${prop.optional ? '?' : ''}: ${tsType};`;
        });
        return `export interface ${entityTypeInfo.name} {\n${tsProperties.join('\n')}\n}\n`;
    }
};
exports.EntityTypeService = EntityTypeService;
exports.EntityTypeService = EntityTypeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        manifest_service_1.ManifestService])
], EntityTypeService);
