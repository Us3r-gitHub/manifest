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
exports.RelationshipService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const entity_service_1 = require("./entity.service");
const common_2 = require("../../../../common/src");
const pluralize_1 = __importDefault(require("pluralize"));
let RelationshipService = class RelationshipService {
    constructor(entityService) {
        this.entityService = entityService;
    }
    getEntitySchemaRelationOptions(entityManifest) {
        const relationOptions = {};
        entityManifest.relationships
            .filter((relationship) => relationship.type === 'many-to-one')
            .forEach((belongsToRelationShip) => {
            relationOptions[belongsToRelationShip.name] = {
                target: belongsToRelationShip.entity,
                type: 'many-to-one',
                eager: !!belongsToRelationShip.eager,
                onDelete: entityManifest.nested ? 'CASCADE' : 'SET NULL'
            };
        });
        entityManifest.relationships
            .filter((relationship) => relationship.type === 'many-to-many')
            .forEach((manyToManyRelationShip) => {
            relationOptions[manyToManyRelationShip.name] = {
                target: manyToManyRelationShip.entity,
                type: 'many-to-many',
                eager: !!manyToManyRelationShip.eager,
                inverseSide: manyToManyRelationShip.inverseSide
            };
            if (manyToManyRelationShip.owningSide) {
                relationOptions[manyToManyRelationShip.name].joinTable = {
                    name: `${(0, common_2.camelize)(entityManifest.className)}_${pluralize_1.default.singular(manyToManyRelationShip.name)}`
                };
            }
        });
        entityManifest.relationships
            .filter((relationship) => relationship.type === 'one-to-many')
            .forEach((oneToManyRelationship) => {
            relationOptions[oneToManyRelationship.name] = {
                target: oneToManyRelationship.entity,
                type: 'one-to-many',
                eager: false,
                inverseSide: oneToManyRelationship.inverseSide,
                cascade: oneToManyRelationship.nested
            };
        });
        entityManifest.relationships
            .filter((relationship) => relationship.type === 'one-to-one')
            .forEach((oneToOneRelationship) => {
            relationOptions[oneToOneRelationship.name] = {
                target: oneToOneRelationship.entity,
                type: 'one-to-one',
                eager: false,
                inverseSide: oneToOneRelationship.inverseSide,
                cascade: !!oneToOneRelationship.nested,
                onDelete: entityManifest.nested ? 'CASCADE' : 'SET NULL',
                joinColumn: !!entityManifest.nested
            };
        });
        return relationOptions;
    }
    async fetchRelationItemsFromDto({ itemDto, relationships, emptyMissing }) {
        const fetchPromises = {};
        relationships.forEach(async (relationship) => {
            const propertyName = (0, common_2.getDtoPropertyNameFromRelationship)(relationship);
            const relationIds = typeof itemDto[propertyName] === 'string'
                ? [itemDto[propertyName]]
                : itemDto[propertyName] || [];
            if (relationIds.length) {
                const relatedEntityRepository = this.entityService.getEntityRepository({
                    entityMetadata: this.entityService.getEntityMetadata({
                        className: relationship.entity
                    })
                });
                fetchPromises[relationship.name] =
                    relationship.type === 'many-to-one'
                        ? relatedEntityRepository.findOneBy({ id: relationIds[0] })
                        : relatedEntityRepository.findBy({
                            id: (0, typeorm_1.In)(relationIds)
                        });
            }
            else {
                if (emptyMissing) {
                    fetchPromises[relationship.name] =
                        relationship.type === 'many-to-one'
                            ? Promise.resolve(null)
                            : Promise.resolve([]);
                }
            }
        });
        const relationItems = {};
        for (const [key, fetchPromise] of Object.entries(fetchPromises)) {
            relationItems[key] = await fetchPromise;
        }
        return relationItems;
    }
};
exports.RelationshipService = RelationshipService;
exports.RelationshipService = RelationshipService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => entity_service_1.EntityService))),
    __metadata("design:paramtypes", [entity_service_1.EntityService])
], RelationshipService);
