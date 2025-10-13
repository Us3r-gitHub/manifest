import { ConfigService } from '@nestjs/config';
import { ManifestService } from '../../manifest/services/manifest.service';
import { EntityTsTypeInfo } from '../types/entity-ts-type-info';
export declare class EntityTypeService {
    private readonly configService;
    private readonly manifestService;
    constructor(configService: ConfigService, manifestService: ManifestService);
    generateEntityTypeInfos(): EntityTsTypeInfo[];
    private generateEntityTypeInfoFromManifest;
    private generateCreateDtoTypeInfoFromManifest;
    generateTSInterfaceFromEntityTypeInfo(entityTypeInfo: EntityTsTypeInfo): string;
}
