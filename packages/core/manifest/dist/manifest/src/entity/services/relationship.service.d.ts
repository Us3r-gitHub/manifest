import { BaseEntity, EntityManifest, RelationshipManifest } from '@repo/types';
import { EntitySchemaRelationOptions } from 'typeorm';
import { EntityService } from './entity.service';
export declare class RelationshipService {
    private entityService;
    constructor(entityService: EntityService);
    getEntitySchemaRelationOptions(entityManifest: EntityManifest): {
        [key: string]: EntitySchemaRelationOptions;
    };
    fetchRelationItemsFromDto({ itemDto, relationships, emptyMissing }: {
        itemDto: object;
        relationships: RelationshipManifest[];
        emptyMissing?: boolean;
    }): Promise<{
        [key: string]: BaseEntity | BaseEntity[];
    }>;
}
