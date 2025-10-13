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
exports.OpenApiCrudService = void 0;
const types_1 = require("../../../../types/src");
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common/src");
const constants_1 = require("../../constants");
const open_api_utils_service_1 = require("./open-api-utils.service");
const prop_type_valid_where_operators_1 = require("../../crud/records/prop-type-valid-where-operators");
const common_3 = require("../../../../common/src");
const where_operator_descriptions_1 = require("../schemas/where-operator-descriptions");
let OpenApiCrudService = class OpenApiCrudService {
    constructor(openApiUtilsService) {
        this.openApiUtilsService = openApiUtilsService;
    }
    generateEntityPaths(entityManifests) {
        const paths = {};
        entityManifests
            .filter((entityManifest) => !entityManifest.single && !entityManifest.nested)
            .forEach((entityManifest) => {
            paths[`/${constants_1.COLLECTIONS_PATH}/${entityManifest.slug}`] = {};
            paths[`/${constants_1.COLLECTIONS_PATH}/${entityManifest.slug}/{id}`] = {};
            paths[`/${constants_1.COLLECTIONS_PATH}/${entityManifest.slug}/select-options`] = {};
            if (this.isNotForbidden(entityManifest.policies.create)) {
                Object.assign(paths[`/${constants_1.COLLECTIONS_PATH}/${entityManifest.slug}`], this.generateCreatePath(entityManifest));
            }
            if (this.isNotForbidden(entityManifest.policies.read)) {
                Object.assign(paths[`/${constants_1.COLLECTIONS_PATH}/${entityManifest.slug}`], this.generateListPath(entityManifest));
                Object.assign(paths[`/${constants_1.COLLECTIONS_PATH}/${entityManifest.slug}/{id}`], this.generateDetailPath(entityManifest));
                Object.assign(paths[`/${constants_1.COLLECTIONS_PATH}/${entityManifest.slug}/select-options`], this.generateListSelectOptionsPath(entityManifest));
            }
            if (this.isNotForbidden(entityManifest.policies.update)) {
                Object.assign(paths[`/${constants_1.COLLECTIONS_PATH}/${entityManifest.slug}/{id}`], this.generateUpdatePath(entityManifest), this.generatePatchPath(entityManifest));
            }
            if (this.isNotForbidden(entityManifest.policies.delete)) {
                Object.assign(paths[`/${constants_1.COLLECTIONS_PATH}/${entityManifest.slug}/{id}`], this.generateDeletePath(entityManifest));
            }
        });
        entityManifests
            .filter((entityManifest) => entityManifest.single)
            .forEach((entityManifest) => {
            if (this.isNotForbidden(entityManifest.policies.read)) {
                paths[`/${constants_1.SINGLES_PATH}/${entityManifest.slug}`] = {
                    ...this.generateDetailPath(entityManifest, true)
                };
            }
            if (this.isNotForbidden(entityManifest.policies.update)) {
                paths[`/${constants_1.SINGLES_PATH}/${entityManifest.slug}`] = {
                    ...this.generateDetailPath(entityManifest, true),
                    ...this.generatePatchPath(entityManifest, true)
                };
            }
        });
        return paths;
    }
    generateListPath(entityManifest) {
        return {
            get: {
                summary: `List ${entityManifest.namePlural}`,
                description: `Retrieves a paginated list of ${entityManifest.namePlural}. In addition to the general parameters below, each property of the ${entityManifest.nameSingular} can be used as a filter: https://manifest.build/docs/crud#get-a-list-of-items`,
                tags: [(0, common_2.upperCaseFirstLetter)(entityManifest.namePlural)],
                security: this.openApiUtilsService.getSecurityRequirements(entityManifest.policies.read),
                parameters: [
                    {
                        name: 'page',
                        in: 'query',
                        description: 'The page number',
                        required: false,
                        schema: {
                            type: 'integer',
                            default: 1
                        }
                    },
                    {
                        name: 'perPage',
                        in: 'query',
                        description: 'The number of items per page',
                        required: false,
                        schema: {
                            type: 'integer',
                            default: 10
                        }
                    },
                    {
                        name: 'orderBy',
                        in: 'query',
                        description: 'The field to order by',
                        required: false,
                        schema: {
                            type: 'string',
                            enum: entityManifest.properties.map((property) => property.name)
                        }
                    },
                    {
                        name: 'order',
                        in: 'query',
                        description: 'The order direction',
                        required: false,
                        schema: {
                            type: 'string',
                            enum: ['ASC', 'DESC']
                        }
                    },
                    {
                        name: 'relations',
                        in: 'query',
                        description: 'The relations to include. For several relations, use a comma-separated list',
                        required: false,
                        style: 'form',
                        explode: false,
                        schema: {
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: entityManifest.relationships.map((relation) => relation.name)
                            }
                        }
                    },
                    ...this.generateFilterParameters(entityManifest)
                ],
                responses: {
                    '200': {
                        description: 'OK',
                        content: {
                            'application/json': {
                                schema: {
                                    allOf: [
                                        {
                                            $ref: '#/components/schemas/Paginator'
                                        },
                                        {
                                            type: 'object',
                                            properties: {
                                                data: {
                                                    type: 'array',
                                                    items: {
                                                        $ref: `#/components/schemas/${entityManifest.className}`
                                                    }
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    generateListSelectOptionsPath(entityManifest) {
        return {
            get: {
                summary: `List ${entityManifest.namePlural} for select options (admin panel)`,
                description: `Retrieves a list of ${entityManifest.namePlural} for select options. The response is an array of objects with the properties 'id' and 'label'. Used in the admin panel to fill select dropdowns.`,
                tags: [(0, common_2.upperCaseFirstLetter)(entityManifest.namePlural)],
                security: [
                    {
                        Admin: []
                    }
                ],
                responses: {
                    '200': {
                        description: `List of ${entityManifest.namePlural} for select options`,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        $ref: `#/components/schemas/SelectOption`
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    generateCreatePath(entityManifest) {
        return {
            post: {
                summary: `Create a new ${entityManifest.nameSingular}`,
                description: `Creates a new ${entityManifest.nameSingular} passing the properties in the request body as JSON.`,
                tags: [(0, common_2.upperCaseFirstLetter)(entityManifest.namePlural)],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: `#/components/schemas/CreateUpdate${entityManifest.className}Dto`
                            }
                        }
                    }
                },
                security: this.openApiUtilsService.getSecurityRequirements(entityManifest.policies.create),
                responses: {
                    '201': {
                        description: `OK`,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: `#/components/schemas/${entityManifest.className}`
                                }
                            }
                        }
                    },
                    '400': {
                        description: `Bad request`,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Validation failed'
                                        },
                                        error: {
                                            type: 'string',
                                            example: 'Bad Request'
                                        },
                                        statusCode: {
                                            type: 'integer',
                                            example: 400
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    generateDetailPath(entityManifest, single) {
        return {
            get: {
                summary: `Get a single ${entityManifest.nameSingular}`,
                description: `Retrieves the details of a single ${entityManifest.nameSingular} by its ID.`,
                tags: [
                    (0, common_2.upperCaseFirstLetter)(entityManifest.namePlural || entityManifest.nameSingular)
                ],
                parameters: single
                    ? []
                    : [
                        {
                            name: 'id',
                            in: 'path',
                            description: `The ID of the ${entityManifest.nameSingular}`,
                            required: true,
                            schema: {
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000'
                            }
                        },
                        {
                            name: 'relations',
                            in: 'query',
                            description: 'The relations to include. For several relations, use a comma-separated list',
                            required: false,
                            style: 'form',
                            explode: false,
                            schema: {
                                type: 'array',
                                items: {
                                    type: 'string',
                                    enum: entityManifest.relationships.map((relation) => relation.name)
                                }
                            }
                        }
                    ],
                security: this.openApiUtilsService.getSecurityRequirements(entityManifest.policies.read),
                responses: {
                    '200': {
                        description: `OK`,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: `#/components/schemas/${entityManifest.className}`
                                }
                            }
                        }
                    },
                    '404': {
                        description: `The ${entityManifest.nameSingular} was not found`
                    }
                }
            }
        };
    }
    generateUpdatePath(entityManifest, single) {
        return {
            put: {
                summary: `Update an existing ${entityManifest.nameSingular} (full replace)`,
                description: `Updates a single ${entityManifest.nameSingular} by its ID. The properties to update are passed in the request body as JSON. This operation fully replaces the entity and its relations. Leaving a property out will remove it.`,
                tags: [
                    (0, common_2.upperCaseFirstLetter)(entityManifest.namePlural || entityManifest.nameSingular)
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: `#/components/schemas/CreateUpdate${entityManifest.className}Dto`
                            }
                        }
                    }
                },
                parameters: single
                    ? []
                    : [
                        {
                            name: 'id',
                            in: 'path',
                            description: `The ID of the ${entityManifest.nameSingular}`,
                            required: true,
                            schema: {
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000'
                            }
                        }
                    ],
                security: this.openApiUtilsService.getSecurityRequirements(entityManifest.policies.update),
                responses: {
                    '200': {
                        description: `OK`,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: `#/components/schemas/${entityManifest.className}`
                                }
                            }
                        }
                    },
                    '404': {
                        description: `Not found`,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Item not Found'
                                        },
                                        error: {
                                            type: 'string',
                                            example: 'Not Found'
                                        },
                                        statusCode: {
                                            type: 'integer',
                                            example: 404
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    generatePatchPath(entityManifest, single) {
        return {
            patch: {
                summary: `Update an existing ${entityManifest.nameSingular} (partial update)`,
                description: `Updates a single ${entityManifest.nameSingular} by its ID. The properties to update are passed in the request body as JSON. This operation partially updates the entity and its relations. Leaving a property out will not remove it.`,
                tags: [
                    (0, common_2.upperCaseFirstLetter)(entityManifest.namePlural || entityManifest.nameSingular)
                ],
                requestBody: {
                    content: {
                        'application/json': {
                            schema: {
                                $ref: `#/components/schemas/CreateUpdate${entityManifest.className}Dto`
                            }
                        }
                    }
                },
                parameters: single
                    ? []
                    : [
                        {
                            name: 'id',
                            in: 'path',
                            description: `The ID of the ${entityManifest.nameSingular}`,
                            required: true,
                            schema: {
                                type: 'string',
                                format: 'uuid',
                                example: '123e4567-e89b-12d3-a456-426614174000'
                            }
                        }
                    ],
                security: this.openApiUtilsService.getSecurityRequirements(entityManifest.policies.update),
                responses: {
                    '200': {
                        description: `OK`,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: `#/components/schemas/${entityManifest.className}`
                                }
                            }
                        }
                    },
                    '404': {
                        description: `Not found`,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Item not Found'
                                        },
                                        error: {
                                            type: 'string',
                                            example: 'Not Found'
                                        },
                                        statusCode: {
                                            type: 'integer',
                                            example: 404
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    generateDeletePath(entityManifest) {
        return {
            delete: {
                summary: `Delete an existing ${entityManifest.nameSingular}`,
                description: `Deletes a single ${entityManifest.nameSingular} by its ID.`,
                tags: [(0, common_2.upperCaseFirstLetter)(entityManifest.namePlural)],
                parameters: [
                    {
                        name: 'id',
                        in: 'path',
                        description: `The ID of the ${entityManifest.nameSingular}`,
                        required: true,
                        schema: {
                            type: 'string',
                            format: 'uuid',
                            example: '123e4567-e89b-12d3-a456-426614174000'
                        }
                    }
                ],
                security: this.openApiUtilsService.getSecurityRequirements(entityManifest.policies.delete),
                responses: {
                    '200': {
                        description: `OK`,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: `#/components/schemas/${entityManifest.className}`
                                }
                            }
                        }
                    },
                    '404': {
                        description: `The ${entityManifest.nameSingular} was not found`,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        message: {
                                            type: 'string',
                                            example: 'Not Found'
                                        },
                                        error: {
                                            type: 'string',
                                            example: 'Not Found'
                                        },
                                        statusCode: {
                                            type: 'integer',
                                            example: 404
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
    }
    isNotForbidden(policies) {
        return policies.every((policy) => {
            return policy.access !== 'forbidden';
        });
    }
    generateFilterParameters(entityManifest) {
        const filterParameters = [];
        for (const property of entityManifest.properties) {
            for (const suffix of Object.values(types_1.WhereKeySuffix)) {
                const whereOperator = (0, common_3.getRecordKeyByValue)(types_1.whereOperatorKeySuffix, suffix);
                if (!(0, prop_type_valid_where_operators_1.isValidWhereOperator)(property.type, whereOperator)) {
                    continue;
                }
                const paramName = `${property.name}${suffix}`;
                let schema;
                switch (property.type) {
                    case 'number':
                        schema = { type: 'number' };
                        break;
                    case 'boolean':
                        schema = { type: 'boolean' };
                        break;
                    case 'date':
                        schema = { type: 'string', format: 'date-time' };
                        break;
                    default:
                        schema = { type: 'string' };
                }
                if (suffix === types_1.WhereKeySuffix.In) {
                    schema = {
                        type: 'string'
                    };
                }
                filterParameters.push({
                    name: paramName,
                    in: 'query',
                    description: where_operator_descriptions_1.WHERE_OPERATOR_DESCRIPTIONS[whereOperator](entityManifest.namePlural, property.name),
                    required: false,
                    schema
                });
            }
        }
        return filterParameters;
    }
};
exports.OpenApiCrudService = OpenApiCrudService;
exports.OpenApiCrudService = OpenApiCrudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [open_api_utils_service_1.OpenApiUtilsService])
], OpenApiCrudService);
