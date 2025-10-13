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
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiService = void 0;
const common_1 = require("@nestjs/common");
const open_api_crud_service_1 = require("./open-api-crud.service");
const manifest_service_1 = require("../../manifest/services/manifest.service");
const open_api_manifest_service_1 = require("./open-api-manifest.service");
const open_api_auth_service_1 = require("./open-api-auth.service");
const open_api_endpoint_service_1 = require("./open-api.endpoint.service");
const config_1 = require("@nestjs/config");
const constants_1 = require("../../constants");
const open_api_schema_service_1 = require("./open-api-schema.service");
const normalize_entities_utils_1 = require("../../entity/utils/normalize-entities.utils");
let OpenApiService = class OpenApiService {
    constructor(manifestService, openApiCrudService, openApiManifestService, openApiAuthService, openApiEndpointService, openApiSchemaService, configService) {
        this.manifestService = manifestService;
        this.openApiCrudService = openApiCrudService;
        this.openApiManifestService = openApiManifestService;
        this.openApiAuthService = openApiAuthService;
        this.openApiEndpointService = openApiEndpointService;
        this.openApiSchemaService = openApiSchemaService;
        this.configService = configService;
    }
    generateOpenApiObject(entityTypeInfos) {
        const appManifest = this.manifestService.getAppManifest();
        const manifestId = this.manifestService.getManifestId();
        const isMultiTenant = this.configService.get('isMultiTenant');
        const entities = (0, normalize_entities_utils_1.normalizeEntities)(appManifest.entities, manifestId);
        return {
            openapi: '3.1.0',
            info: {
                title: appManifest.name,
                version: appManifest.version
            },
            servers: [
                {
                    url: `${this.configService.get('baseUrl')}/${constants_1.API_PATH}${isMultiTenant ? `/${manifestId}` : ''}`,
                    description: `${this.configService.get('nodeEnv') === 'production' ? 'Production' : 'Development'} server`
                }
            ],
            paths: {
                ...this.openApiCrudService.generateEntityPaths(Object.values(entities)),
                ...this.openApiManifestService.generateManifestPaths(Object.values(entities)),
                ...this.openApiAuthService.generateAuthPaths(Object.values(entities)),
                ...this.openApiEndpointService.generateEndpointPaths(appManifest.endpoints)
            },
            components: {
                schemas: Object.assign({}, this.openApiSchemaService.generateEntitySchemas(entityTypeInfos), this.openApiSchemaService.getGeneralSchemas()),
                securitySchemes: this.openApiAuthService.getSecuritySchemes(appManifest)
            }
        };
    }
};
exports.OpenApiService = OpenApiService;
exports.OpenApiService = OpenApiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [manifest_service_1.ManifestService,
        open_api_crud_service_1.OpenApiCrudService,
        open_api_manifest_service_1.OpenApiManifestService,
        open_api_auth_service_1.OpenApiAuthService,
        open_api_endpoint_service_1.OpenApiEndpointService,
        open_api_schema_service_1.OpenApiSchemaService,
        config_1.ConfigService])
], OpenApiService);
