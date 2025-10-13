import { BaseEntity, EntityManifest, PropertyManifest, RelationshipManifest } from '@repo/types';
import { ConfigService } from '@nestjs/config';
import { DataSource, EntityMetadata, Repository } from 'typeorm';
import { StorageService } from '../../storage/services/storage.service';
import { EntityService } from '../../entity/services/entity.service';
import { ManifestService } from '../../manifest/services/manifest.service';
import { EntityManifestService } from '../../manifest/services/entity-manifest.service';
export declare class SeederService {
    private configService;
    private entityService;
    private manifestService;
    private entityManifestService;
    private storageService;
    private dataSource;
    seededFiles: {
        [key: string]: string;
    };
    seededImages: {
        [key: string]: {
            [key: string]: string;
        };
    };
    records: {
        [key: string]: BaseEntity[];
    };
    constructor(configService: ConfigService, entityService: EntityService, manifestService: ManifestService, entityManifestService: EntityManifestService, storageService: StorageService, dataSource: DataSource);
    seed(tableName?: string): Promise<void>;
    seedEntities(entityMetadatas: EntityMetadata[]): Promise<void>;
    seedProperty(propertyManifest: PropertyManifest, entityManifest: EntityManifest): Promise<string | number | boolean | object | unknown>;
    private seedRichText;
    private seedChoice;
    private seedFile;
    private seedImage;
    private seedLocation;
    seedAdmin(repository: Repository<BaseEntity>, manifestId?: string): Promise<void>;
    seedRelationships(relationshipManifest: RelationshipManifest): Promise<string | {
        id: string;
    }[]>;
    private getRandomUniqueIds;
}
