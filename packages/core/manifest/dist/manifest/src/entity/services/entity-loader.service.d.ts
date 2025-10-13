import { AuthenticableEntity, BaseEntity, DatabaseConnection } from '@repo/types';
import { ConfigService } from '@nestjs/config';
import { EntitySchema as TypeORMEntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { RelationshipService } from './relationship.service';
import { ManifestService } from '../../manifest/services/manifest.service';
export declare class EntityLoaderService {
    private configService;
    private manifestService;
    private relationshipService;
    constructor(configService: ConfigService, manifestService: ManifestService, relationshipService: RelationshipService);
    loadEntities(dbConnection: DatabaseConnection): TypeORMEntitySchema[];
    getBaseEntityColumns(dbConnection: DatabaseConnection): {
        [key in keyof BaseEntity]: EntitySchemaColumnOptions;
    };
    getBaseAuthenticableEntityColumns(dbConnection: DatabaseConnection): {
        [key in keyof AuthenticableEntity]: EntitySchemaColumnOptions;
    };
}
