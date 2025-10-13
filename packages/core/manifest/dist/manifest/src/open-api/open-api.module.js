"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiModule = void 0;
const common_1 = require("@nestjs/common");
const open_api_service_1 = require("./services/open-api.service");
const open_api_crud_service_1 = require("./services/open-api-crud.service");
const manifest_module_1 = require("../manifest/manifest.module");
const open_api_manifest_service_1 = require("./services/open-api-manifest.service");
const open_api_auth_service_1 = require("./services/open-api-auth.service");
const open_api_endpoint_service_1 = require("./services/open-api.endpoint.service");
const open_api_utils_service_1 = require("./services/open-api-utils.service");
const open_api_schema_service_1 = require("./services/open-api-schema.service");
let OpenApiModule = class OpenApiModule {
};
exports.OpenApiModule = OpenApiModule;
exports.OpenApiModule = OpenApiModule = __decorate([
    (0, common_1.Module)({
        imports: [manifest_module_1.ManifestModule],
        providers: [
            open_api_service_1.OpenApiService,
            open_api_crud_service_1.OpenApiCrudService,
            open_api_manifest_service_1.OpenApiManifestService,
            open_api_auth_service_1.OpenApiAuthService,
            open_api_endpoint_service_1.OpenApiEndpointService,
            open_api_schema_service_1.OpenApiSchemaService,
            open_api_utils_service_1.OpenApiUtilsService
        ]
    })
], OpenApiModule);
