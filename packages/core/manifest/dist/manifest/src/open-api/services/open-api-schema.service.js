"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiSchemaService = void 0;
const common_1 = require("@nestjs/common");
const general_schemas_1 = require("../schemas/general-schemas");
const ts_type_schema_types_1 = require("../schemas/ts-type-schema-types");
const prop_type_examples_1 = require("../schemas/prop-type-examples");
const prop_type_formats_1 = require("../schemas/prop-type-formats");
const src_1 = require("../../../../types/src");
let OpenApiSchemaService = class OpenApiSchemaService {
    getGeneralSchemas() {
        return general_schemas_1.generalSchemas;
    }
    generateEntitySchemas(entityTypeInfos) {
        const entitySchemas = {};
        entityTypeInfos.forEach((entityTsTypeInfo) => {
            const properties = {};
            entityTsTypeInfo.properties
                .filter((property) => !property.isRelationship)
                .forEach((property) => {
                properties[property.name] = this.generatePropertySchema(property);
            });
            if (entityTsTypeInfo.nested) {
                delete properties['id'];
            }
            entityTsTypeInfo.properties
                .filter((property) => property.isRelationship)
                .forEach((property) => {
                properties[property.name] = this.generateRelationshipSchema(property);
            });
            entitySchemas[entityTsTypeInfo.name] = {
                type: 'object',
                description: `${entityTsTypeInfo.name} entity schema`,
                properties
            };
        });
        return entitySchemas;
    }
    generatePropertySchema(property) {
        if (property.manifestPropType === src_1.PropType.Image) {
            return {
                description: `The ${property.name} property of the entity (${property.manifestPropType})`,
                type: 'object',
                additionalProperties: false,
                example: Object.keys(property.sizes).reduce((acc, size) => {
                    acc[size] = `https://example.com/image-${size}.jpg`;
                    return acc;
                }, {}),
                required: Object.keys(property.sizes || {}),
                properties: Object.keys(property.sizes || {}).reduce((acc, size) => {
                    acc[size] = {
                        type: 'string',
                        format: 'uri',
                        description: `Image URL for size ${size}`,
                        example: `https://example.com/image-${size}.jpg`
                    };
                    return acc;
                }, {})
            };
        }
        const schema = JSON.parse(JSON.stringify(ts_type_schema_types_1.tsTypeSchemaTypes[property.type] || {}));
        if (Object.keys(schema).length === 0) {
            throw new Error(`No schema found for property type: ${property.type} (${property.manifestPropType})`);
        }
        if (property.manifestPropType === src_1.PropType.Choice &&
            property.values?.length > 0) {
            return {
                type: 'string',
                description: `The ${property.name} property of the entity (${property.manifestPropType})`,
                enum: property.values,
                example: property.values[0]
            };
        }
        else if (property.name === 'id') {
            schema.description = `The unique identifier for the entity`;
            schema.format = 'uuid';
            schema.example = '123e4567-e89b-12d3-a456-426614174000';
        }
        else {
            schema.description = `The ${property.name} property of the entity (${property.manifestPropType})`;
            schema.example = prop_type_examples_1.propTypeExamples[property.manifestPropType];
            const format = prop_type_formats_1.propTypeFormats[property.manifestPropType];
            if (format) {
                schema.format = format;
            }
        }
        schema.nullable = !property.optional;
        return schema;
    }
    generateRelationshipSchema(property) {
        const propertyType = property.type;
        const isArray = propertyType.endsWith('[]');
        if (propertyType === 'string' || propertyType === 'string[]') {
            if (isArray) {
                return {
                    type: 'array',
                    description: `Array of IDs for ${property.name} entities`,
                    items: {
                        type: 'string',
                        format: 'uuid',
                        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
                    }
                };
            }
            else {
                return {
                    type: 'string',
                    description: `ID of the ${property.name} entity`,
                    format: 'uuid',
                    example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
                };
            }
        }
        if (isArray) {
            return {
                type: 'array',
                description: `Array of ${property.name} entities`,
                items: {
                    $ref: `#/components/schemas/${propertyType.replace('[]', '')}`
                }
            };
        }
        else {
            return {
                type: 'object',
                description: `Single ${property.name} entity`,
                $ref: `#/components/schemas/${propertyType}`
            };
        }
    }
};
exports.OpenApiSchemaService = OpenApiSchemaService;
exports.OpenApiSchemaService = OpenApiSchemaService = __decorate([
    (0, common_1.Injectable)()
], OpenApiSchemaService);
