import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { EntityTsTypeInfo } from '../../entity/types/entity-ts-type-info';
export declare class OpenApiSchemaService {
    getGeneralSchemas(): Record<string, SchemaObject>;
    generateEntitySchemas(entityTypeInfos: EntityTsTypeInfo[]): Record<string, SchemaObject>;
    private generatePropertySchema;
    private generateRelationshipSchema;
}
