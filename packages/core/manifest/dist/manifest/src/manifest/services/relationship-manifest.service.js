"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationshipManifestService = void 0;
const common_1 = require("@nestjs/common");
const src_1 = require("../../../../types/src");
const common_2 = require("../../../../common/src");
const pluralize_1 = __importDefault(require("pluralize"));
let RelationshipManifestService = class RelationshipManifestService {
    transformRelationship(relationship, type, entityClassName) {
        if (type === 'many-to-one') {
            if (typeof relationship === 'string') {
                return {
                    name: (0, common_2.camelize)(relationship),
                    entity: relationship,
                    eager: false,
                    type
                };
            }
            return {
                name: (0, common_2.camelize)(relationship.name || relationship.entity),
                entity: relationship.entity,
                eager: relationship.eager || false,
                helpText: relationship.helpText || '',
                type
            };
        }
        else {
            if (typeof relationship === 'string') {
                return {
                    name: (0, pluralize_1.default)((0, common_2.camelize)(relationship)),
                    entity: relationship,
                    eager: false,
                    type,
                    owningSide: true,
                    inverseSide: (0, pluralize_1.default)((0, common_2.camelize)(entityClassName))
                };
            }
            return {
                name: (0, pluralize_1.default)((0, common_2.camelize)(relationship.name || relationship.entity)),
                entity: relationship.entity,
                eager: relationship.eager || false,
                helpText: relationship.helpText || '',
                type,
                owningSide: true,
                inverseSide: (0, pluralize_1.default)((0, common_2.camelize)(entityClassName))
            };
        }
    }
    getRelationshipManifestsFromNestedProperties(nestedEntityManifest, allEntityManifests) {
        return allEntityManifests.reduce((acc, entityManifest) => {
            entityManifest.properties
                .filter((property) => property.type === src_1.PropType.Nested &&
                property.options?.group === nestedEntityManifest.className)
                .forEach((property) => {
                acc.push({
                    name: (0, common_2.camelize)(entityManifest.nameSingular),
                    inverseSide: property.name,
                    entity: entityManifest.className,
                    owningSide: true,
                    type: property.options?.multiple === false
                        ? 'one-to-one'
                        : 'many-to-one',
                    eager: false,
                    helpText: property.helpText || ''
                });
            });
            return acc;
        }, []);
    }
    getOppositeOneToManyRelationships(entityManifests, currentEntityManifest) {
        const oppositeRelationships = entityManifests
            .filter((otherEntityManifest) => otherEntityManifest.className !== currentEntityManifest.className)
            .reduce((acc, otherEntityManifest) => {
            const oppositeRelationship = otherEntityManifest.relationships.find((relationship) => relationship.entity === currentEntityManifest.className &&
                relationship.type === 'many-to-one');
            if (oppositeRelationship) {
                acc.push({
                    entity: otherEntityManifest,
                    relationship: oppositeRelationship
                });
            }
            return acc;
        }, []);
        return oppositeRelationships.map((oppositeRelationship) => {
            const relationship = {
                name: (0, common_2.camelize)(oppositeRelationship.entity.namePlural),
                entity: oppositeRelationship.entity.className,
                eager: !!oppositeRelationship.entity.nested,
                nested: !!oppositeRelationship.entity.nested,
                type: 'one-to-many',
                inverseSide: oppositeRelationship.relationship.name,
                helpText: oppositeRelationship.relationship.helpText || ''
            };
            return relationship;
        });
    }
    getOppositeManyToManyRelationships(entityManifests, currentEntityManifest) {
        const oppositeRelationships = entityManifests
            .filter((otherEntityManifest) => otherEntityManifest.className !== currentEntityManifest.className)
            .reduce((acc, otherEntityManifest) => {
            const oppositeRelationship = otherEntityManifest.relationships.find((relationship) => relationship.entity === currentEntityManifest.className &&
                relationship.type === 'many-to-many' &&
                relationship.owningSide === true);
            if (oppositeRelationship) {
                acc.push({
                    entity: otherEntityManifest,
                    relationship: oppositeRelationship
                });
            }
            return acc;
        }, []);
        return oppositeRelationships.map((oppositeRelationship) => {
            const relationship = {
                name: (0, pluralize_1.default)((0, common_2.camelize)(oppositeRelationship.entity.namePlural)),
                entity: oppositeRelationship.entity.className,
                eager: false,
                type: 'many-to-many',
                owningSide: false,
                inverseSide: oppositeRelationship.relationship.name
            };
            return relationship;
        });
    }
    getOppositeOneToOneRelationships(entityManifests, currentEntityManifest) {
        const oppositeRelationships = entityManifests
            .filter((otherEntityManifest) => otherEntityManifest.className !== currentEntityManifest.className)
            .reduce((acc, otherEntityManifest) => {
            const oppositeRelationship = otherEntityManifest.relationships.find((relationship) => relationship.entity === currentEntityManifest.className &&
                relationship.type === 'one-to-one' &&
                relationship.owningSide === true);
            if (oppositeRelationship) {
                acc.push({
                    entity: otherEntityManifest,
                    relationship: oppositeRelationship
                });
            }
            return acc;
        }, []);
        return oppositeRelationships.map((oppositeRelationship) => {
            const relationship = {
                name: (0, common_2.camelize)(oppositeRelationship.entity.nameSingular),
                entity: oppositeRelationship.entity.className,
                eager: !!oppositeRelationship.entity.nested,
                type: 'one-to-one',
                owningSide: false,
                inverseSide: oppositeRelationship.relationship.name,
                nested: !!oppositeRelationship.entity.nested,
                helpText: oppositeRelationship.relationship.helpText || ''
            };
            return relationship;
        });
    }
};
exports.RelationshipManifestService = RelationshipManifestService;
exports.RelationshipManifestService = RelationshipManifestService = __decorate([
    (0, common_1.Injectable)()
], RelationshipManifestService);
