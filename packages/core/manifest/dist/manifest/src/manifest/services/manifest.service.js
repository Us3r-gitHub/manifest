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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManifestService = void 0;
const common_1 = require("@nestjs/common");
const schema_service_1 = require("./schema.service");
const yaml_service_1 = require("./yaml.service");
const constants_1 = require("../../constants");
const entity_manifest_service_1 = require("./entity-manifest.service");
const endpoint_service_1 = require("../../endpoint/endpoint.service");
const config_1 = require("@nestjs/config");
const lock_file_service_1 = require("./lock-file.service");
let ManifestService = class ManifestService {
    constructor(yamlService, schemaService, entityManifestService, endpointService, configService, lockFileService) {
        this.yamlService = yamlService;
        this.schemaService = schemaService;
        this.entityManifestService = entityManifestService;
        this.endpointService = endpointService;
        this.configService = configService;
        this.lockFileService = lockFileService;
        this.manifestId = 'manifest';
        this.appManifests = {};
        this.loadingPromise = null;
    }
    getManifestId() {
        return this.manifestId;
    }
    setManifestId(manifestId) {
        this.manifestId = manifestId;
    }
    getAppManifest(options) {
        if (!this.appManifests[this.manifestId]) {
            throw new Error('Manifest not loaded');
        }
        if (!options?.fullVersion) {
            return this.hideSensitiveInformation(this.appManifests[this.manifestId]);
        }
        return this.appManifests[this.manifestId];
    }
    async loadManifest(manifestFilePath) {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }
        return this.doLoadManifest(manifestFilePath);
    }
    async doLoadManifest(manifestFilePath) {
        const appSchema = await this.yamlService.load(manifestFilePath);
        this.schemaService.validate(appSchema);
        const shouldPrefixTable = this.configService.get('shouldPrefixTable');
        const appManifest = {
            name: appSchema.name || 'Manifest App',
            version: appSchema.version || '1.0.0',
            manifestVersion: this.lockFileService.getInstalledVersion('manifest'),
            environment: this.configService.get('NODE_ENV') || 'development',
            entities: this.entityManifestService
                .transformEntityManifests({
                entities: appSchema.entities || {},
                groups: appSchema.groups || {},
                prefix: shouldPrefixTable ? this.manifestId : undefined
            })
                .reduce((acc, entityManifest) => {
                acc[entityManifest.className] = entityManifest;
                return acc;
            }, {}),
            endpoints: this.endpointService.transformEndpointsSchemaObject(appSchema.endpoints),
            settings: appSchema.settings || {}
        };
        if (this.configService.get('MANIFEST_TELEMETRY_DISABLED')) {
            appManifest.disableTelemetry = true;
        }
        appManifest.entities.Admin = shouldPrefixTable
            ? {
                ...constants_1.ADMIN_ENTITY_MANIFEST,
                properties: [...constants_1.AUTHENTICABLE_PROPS, ...constants_1.TENANT_PROPS]
            }
            : constants_1.ADMIN_ENTITY_MANIFEST;
        this.appManifests[this.manifestId] = appManifest;
        return appManifest;
    }
    hideSensitiveInformation(manifest) {
        return {
            ...manifest,
            entities: Object.entries(manifest.entities)
                .filter(([className]) => className !== constants_1.ADMIN_ENTITY_MANIFEST.className)
                .reduce((acc, [className, entity]) => {
                const { ...publicEntity } = entity;
                acc[className] =
                    this.entityManifestService.hideEntitySensitiveInformation(publicEntity);
                return acc;
            }, {})
        };
    }
};
exports.ManifestService = ManifestService;
exports.ManifestService = ManifestService = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)((0, common_1.forwardRef)(() => entity_manifest_service_1.EntityManifestService))),
    __metadata("design:paramtypes", [yaml_service_1.YamlService,
        schema_service_1.SchemaService,
        entity_manifest_service_1.EntityManifestService,
        endpoint_service_1.EndpointService,
        config_1.ConfigService,
        lock_file_service_1.LockFileService])
], ManifestService);
