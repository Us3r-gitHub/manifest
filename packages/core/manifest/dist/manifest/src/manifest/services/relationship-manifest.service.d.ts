import { EntityManifest, RelationshipManifest, RelationshipSchema } from '../../../../types/src';
export declare class RelationshipManifestService {
    transformRelationship(relationship: RelationshipSchema, type: 'many-to-one' | 'many-to-many', entityClassName?: string): RelationshipManifest;
    getRelationshipManifestsFromNestedProperties(nestedEntityManifest: EntityManifest, allEntityManifests: EntityManifest[]): RelationshipManifest[];
    getOppositeOneToManyRelationships(entityManifests: EntityManifest[], currentEntityManifest: EntityManifest): RelationshipManifest[];
    getOppositeManyToManyRelationships(entityManifests: EntityManifest[], currentEntityManifest: EntityManifest): RelationshipManifest[];
    getOppositeOneToOneRelationships(entityManifests: EntityManifest[], currentEntityManifest: EntityManifest): RelationshipManifest[];
}
