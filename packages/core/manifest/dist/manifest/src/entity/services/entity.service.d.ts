import { BaseEntity } from '@repo/types';
import { DataSource, EntityMetadata, Repository } from 'typeorm';
import { EntityManifestService } from '../../manifest/services/entity-manifest.service';
export declare class EntityService {
    private dataSource;
    private entityManifestService;
    constructor(dataSource: DataSource, entityManifestService: EntityManifestService);
    getEntityMetadatas(): EntityMetadata[];
    getEntityMetadata({ className, slug }: {
        className?: string;
        slug?: string;
    }): EntityMetadata;
    sortEntitiesByHierarchy(entities: EntityMetadata[]): EntityMetadata[];
    getEntityRepository({ entityMetadata, entitySlug }: {
        entityMetadata?: EntityMetadata;
        entitySlug?: string;
    }): Repository<BaseEntity>;
}
