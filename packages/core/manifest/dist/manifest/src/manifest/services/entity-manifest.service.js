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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityManifestService = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("../../../../types/src");
const pluralize_1 = __importDefault(require("pluralize"));
const slugify_1 = __importDefault(require("slugify"));
const dasherize_1 = __importDefault(require("dasherize"));
const relationship_manifest_service_1 = require("./relationship-manifest.service");
const constants_1 = require("../../constants");
const manifest_service_1 = require("./manifest.service");
const hook_service_1 = require("../../hook/hook.service");
const policy_service_1 = require("../../policy/policy.service");
const property_manifest_service_1 = require("./property-manifest.service");
const src_1 = require("../../../../common/src");
let EntityManifestService = class EntityManifestService {
    constructor(relationshipManifestService, manifestService, propertyManifestService, hookService, policyService) {
        this.relationshipManifestService = relationshipManifestService;
        this.manifestService = manifestService;
        this.propertyManifestService = propertyManifestService;
        this.hookService = hookService;
        this.policyService = policyService;
    }
    getEntityManifests(options) {
        const entities = Object.values(this.manifestService.getAppManifest({ fullVersion: true }).entities);
        if (!options?.fullVersion) {
            return entities.map((entity) => this.hideEntitySensitiveInformation(entity));
        }
        return entities;
    }
    getEntityManifest({ className, slug, fullVersion, includeNested = false }) {
        if (!className && !slug) {
            throw new common_1.HttpException(`Either className or slug must be provided`, common_1.HttpStatus.BAD_REQUEST);
        }
        const entities = this.getEntityManifests({ fullVersion });
        let entityManifest;
        if (className) {
            entityManifest = entities.find((entity) => entity.className === className);
        }
        else {
            entityManifest = entities.find((entity) => entity.slug === slug);
        }
        if (!entityManifest || (entityManifest.nested && !includeNested)) {
            throw new common_1.HttpException(`Entity ${className || slug} not found in manifest`, common_1.HttpStatus.NOT_FOUND);
        }
        if (!fullVersion) {
            return this.hideEntitySensitiveInformation(entityManifest);
        }
        return entityManifest;
    }
    transformEntityManifests({ entities, groups, prefix }) {
        const entityManifests = [
            ...Object.entries(entities || {}),
            ...Object.entries(groups || {})
        ].map(([className, entitySchema]) => {
            const prefixTable = prefix ? `${prefix}_` : '';
            const prefixSlug = prefix ? `${prefix}-` : '';
            const entityClassName = entitySchema['className'] || className;
            const partialEntityManifest = {
                className: prefixTable + entityClassName,
                nameSingular: entitySchema['nameSingular']
                    ? (0, src_1.camelize)(entitySchema['nameSingular'])
                    : (0, src_1.camelize)(pluralize_1.default.singular(entityClassName)),
                namePlural: entitySchema['namePlural']
                    ? (0, src_1.camelize)(entitySchema['namePlural'])
                    : (0, src_1.camelize)(pluralize_1.default.plural(entityClassName)),
                slug: prefixSlug +
                    (entitySchema['slug'] ||
                        (0, slugify_1.default)((0, dasherize_1.default)(entitySchema['single']
                            ? entityClassName
                            : entitySchema['namePlural'] ||
                                pluralize_1.default.plural(entityClassName)).toLowerCase())),
                single: entitySchema['single'] || false,
                properties: (entitySchema.properties || [])
                    .filter((propSchema) => propSchema !== 'id' &&
                    propSchema.name !== 'id')
                    .map((propSchema) => this.propertyManifestService.transformPropertyManifest(propSchema, entitySchema)),
                hooks: this.transformHookObject(entitySchema['hooks']) || {},
                middlewares: entitySchema['middlewares'] || {},
                nested: Object.prototype.hasOwnProperty.call(groups || {}, className)
            };
            if (entitySchema['single']) {
                return this.getSingleEntityManifestProps(partialEntityManifest, entitySchema);
            }
            return this.getCollectionEntityManifestProps(partialEntityManifest, entitySchema, prefix);
        });
        entityManifests
            .filter((entityManifest) => entityManifest.nested)
            .forEach((nestedEntity) => {
            nestedEntity.relationships.push(...this.relationshipManifestService.getRelationshipManifestsFromNestedProperties(nestedEntity, entityManifests.filter((e) => !e.nested)));
            if (nestedEntity.relationships.some((relationship) => relationship.type === 'one-to-one')) {
                nestedEntity.seedCount = 1;
            }
        });
        entityManifests.forEach((entityManifest) => {
            entityManifest.relationships.push(...this.relationshipManifestService.getOppositeOneToManyRelationships(entityManifests, entityManifest));
        });
        entityManifests.forEach((entityManifest) => {
            if (entityManifest.single)
                return;
            entityManifest.relationships.push(...this.relationshipManifestService.getOppositeManyToManyRelationships(entityManifests, entityManifest));
        });
        entityManifests.forEach((entityManifest) => {
            entityManifest.relationships.push(...this.relationshipManifestService.getOppositeOneToOneRelationships(entityManifests, entityManifest));
        });
        entityManifests.forEach((entityManifest) => {
            entityManifest.properties = entityManifest.properties.filter((prop) => prop.type !== types_1.PropType.Nested);
        });
        return entityManifests;
    }
    getCollectionEntityManifestProps(partialEntityManifest, entitySchema, prefix) {
        if (entitySchema.authenticable) {
            partialEntityManifest.properties.push(...constants_1.AUTHENTICABLE_PROPS);
        }
        function applyPrefixToRelationship(relationship, prefix) {
            const relationshipWithPrefix = typeof relationship === 'string'
                ? {
                    name: relationship,
                    entity: `${prefix}_${relationship}`,
                    eager: false
                }
                : {
                    ...relationship,
                    name: relationship.name || relationship.entity,
                    entity: `${prefix}_${relationship.entity}`
                };
            return prefix ? relationshipWithPrefix : relationship;
        }
        return {
            ...partialEntityManifest,
            properties: partialEntityManifest.properties,
            hooks: partialEntityManifest.hooks,
            mainProp: entitySchema.mainProp ||
                partialEntityManifest.properties.find((prop) => prop.type === types_1.PropType.String)?.name ||
                partialEntityManifest.properties.find((prop) => prop.type === types_1.PropType.Text)?.name ||
                'id',
            seedCount: entitySchema.seedCount || constants_1.DEFAULT_SEED_COUNT,
            relationships: [
                ...(entitySchema.belongsTo || []).map((relationship) => {
                    return this.relationshipManifestService.transformRelationship(applyPrefixToRelationship(relationship, prefix), 'many-to-one');
                }),
                ...(entitySchema.belongsToMany || []).map((relationship) => {
                    return this.relationshipManifestService.transformRelationship(applyPrefixToRelationship(relationship, prefix), 'many-to-many', partialEntityManifest.className);
                })
            ],
            authenticable: entitySchema.authenticable || false,
            policies: {
                create: this.policyService.transformPolicies(entitySchema.policies?.create, constants_1.ADMIN_ACCESS_POLICY),
                read: this.policyService.transformPolicies(entitySchema.policies?.read, constants_1.ADMIN_ACCESS_POLICY),
                update: this.policyService.transformPolicies(entitySchema.policies?.update, constants_1.ADMIN_ACCESS_POLICY),
                delete: this.policyService.transformPolicies(entitySchema.policies?.delete, constants_1.ADMIN_ACCESS_POLICY),
                signup: entitySchema.authenticable
                    ? this.policyService.transformPolicies(entitySchema.policies?.signup, constants_1.PUBLIC_ACCESS_POLICY)
                    : [constants_1.FORBIDDEN_ACCESS_POLICY]
            }
        };
    }
    getSingleEntityManifestProps(partialEntityManifest, entitySchema) {
        return {
            ...partialEntityManifest,
            namePlural: partialEntityManifest.nameSingular,
            authenticable: false,
            mainProp: null,
            properties: partialEntityManifest.properties,
            hooks: partialEntityManifest.hooks,
            seedCount: 1,
            relationships: [],
            policies: {
                create: [constants_1.FORBIDDEN_ACCESS_POLICY],
                read: this.policyService.transformPolicies(entitySchema.policies?.read, constants_1.ADMIN_ACCESS_POLICY),
                update: this.policyService.transformPolicies(entitySchema.policies?.update, constants_1.ADMIN_ACCESS_POLICY),
                delete: [constants_1.FORBIDDEN_ACCESS_POLICY],
                signup: [constants_1.FORBIDDEN_ACCESS_POLICY]
            }
        };
    }
    transformHookObject(hooksSchema) {
        return types_1.crudEventNames.reduce((acc, event) => {
            acc[event] = (hooksSchema?.[event] || []).map((hook) => this.hookService.transformHookSchemaIntoHookManifest(hook, event));
            return acc;
        }, {});
    }
    transformMiddlewareObject(middlewareSchema) {
        return types_1.crudEventNames.reduce((acc, event) => {
            acc[event] = (middlewareSchema?.[event] || []).map((middleware) => ({
                event,
                handler: middleware.handler
            }));
            return acc;
        }, {});
    }
    hideEntitySensitiveInformation(entityManifest) {
        return {
            ...entityManifest,
            properties: entityManifest.properties
                .filter((prop) => !prop.hidden)
                .map((prop) => {
                delete prop.hidden;
                return prop;
            })
        };
    }
};
exports.EntityManifestService = EntityManifestService;
exports.EntityManifestService = EntityManifestService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)((0, common_1.forwardRef)(() => manifest_service_1.ManifestService))),
    __metadata("design:paramtypes", [relationship_manifest_service_1.RelationshipManifestService,
        manifest_service_1.ManifestService,
        property_manifest_service_1.PropertyManifestService,
        hook_service_1.HookService,
        policy_service_1.PolicyService])
], EntityManifestService);
