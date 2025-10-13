import { OpenApiCrudService } from './open-api-crud.service';
import { OpenAPIObject } from '@nestjs/swagger';
import { ManifestService } from '../../manifest/services/manifest.service';
import { OpenApiManifestService } from './open-api-manifest.service';
import { OpenApiAuthService } from './open-api-auth.service';
import { OpenApiEndpointService } from './open-api.endpoint.service';
import { ConfigService } from '@nestjs/config';
import { EntityTsTypeInfo } from '../../entity/types/entity-ts-type-info';
import { OpenApiSchemaService } from './open-api-schema.service';
export declare class OpenApiService {
    private readonly manifestService;
    private readonly openApiCrudService;
    private readonly openApiManifestService;
    private readonly openApiAuthService;
    private readonly openApiEndpointService;
    private readonly openApiSchemaService;
    private configService;
    constructor(manifestService: ManifestService, openApiCrudService: OpenApiCrudService, openApiManifestService: OpenApiManifestService, openApiAuthService: OpenApiAuthService, openApiEndpointService: OpenApiEndpointService, openApiSchemaService: OpenApiSchemaService, configService: ConfigService);
    generateOpenApiObject(entityTypeInfos: EntityTsTypeInfo[]): OpenAPIObject;
}
