"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const path = __importStar(require("path"));
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const crud_module_1 = require("./crud/crud.module");
const entity_module_1 = require("./entity/entity.module");
const entity_loader_service_1 = require("./entity/services/entity-loader.service");
const logger_module_1 = require("./logger/logger.module");
const logger_service_1 = require("./logger/logger.service");
const manifest_module_1 = require("./manifest/manifest.module");
const seed_module_1 = require("./seed/seed.module");
const health_module_1 = require("./health/health.module");
const open_api_module_1 = require("./open-api/open-api.module");
const validation_module_1 = require("./validation/validation.module");
const upload_module_1 = require("./upload/upload.module");
const storage_module_1 = require("./storage/storage.module");
const manifest_service_1 = require("./manifest/services/manifest.service");
const hook_module_1 = require("./hook/hook.module");
const endpoint_module_1 = require("./endpoint/endpoint.module");
const policy_module_1 = require("./policy/policy.module");
const handler_module_1 = require("./handler/handler.module");
const sdk_module_1 = require("./sdk/sdk.module");
const middleware_module_1 = require("./middleware/middleware.module");
const event_module_1 = require("./event/event.module");
const config_2 = __importDefault(require("./config/config"));
const throttler_1 = require("@nestjs/throttler");
const tenant_based_throttler_guard_1 = require("./tenant-based-throttler-guard");
const core_1 = require("@nestjs/core");
let AppModule = class AppModule {
    constructor(loggerService) {
        this.loggerService = loggerService;
    }
    async onModuleInit() {
        await this.init();
    }
    async init() {
        const isSeed = process.argv[1].includes('seed');
        const isTest = process.env.NODE_ENV === 'test';
        if (!isSeed && !isTest) {
            this.loggerService.initMessage();
        }
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', '.env.contribution'],
                load: [config_2.default]
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule, entity_module_1.EntityModule, manifest_module_1.ManifestModule],
                useFactory: async (configService, entityLoaderService, manifestService) => {
                    let dbConnection;
                    let databaseConfig;
                    switch (configService.get('database').connection) {
                        case 'postgres':
                            dbConnection = 'postgres';
                            databaseConfig = configService.get('database').postgres;
                            break;
                        case 'mysql':
                            dbConnection = 'mysql';
                            databaseConfig = configService.get('database').mysql;
                            break;
                        default:
                            dbConnection = 'sqlite';
                            databaseConfig = configService.get('database').sqlite();
                            break;
                    }
                    const entities = [];
                    if (configService.get('isMultiTenant')) {
                        const manifestFiles = configService.get('manifestFiles');
                        for (const manifestFile of manifestFiles) {
                            const manifestId = path.basename(path.dirname(manifestFile));
                            manifestService.setManifestId(manifestId);
                            await manifestService.loadManifest(manifestFile);
                            const appManifestEntities = entityLoaderService.loadEntities(dbConnection);
                            entities.push(...appManifestEntities);
                        }
                    }
                    else {
                        await manifestService.loadManifest(configService.get('paths').manifestFile);
                        const appManifestEntities = entityLoaderService.loadEntities(dbConnection);
                        entities.push(...appManifestEntities);
                    }
                    return Object.assign(databaseConfig, { entities });
                },
                inject: [config_1.ConfigService, entity_loader_service_1.EntityLoaderService, manifest_service_1.ManifestService]
            }),
            throttler_1.ThrottlerModule.forRootAsync({
                imports: [config_1.ConfigModule, entity_module_1.EntityModule, manifest_module_1.ManifestModule],
                useFactory: async (configService, manifestService) => {
                    const rateLimits = [];
                    if (configService.get('isMultiTenant')) {
                        const manifestFiles = configService.get('manifestFiles');
                        for (const manifestFile of manifestFiles) {
                            const manifestId = path.basename(path.dirname(manifestFile));
                            manifestService.setManifestId(manifestId);
                            const appManifest = await manifestService.loadManifest(manifestFile);
                            const appManifestRateLimits = (appManifest.settings.rateLimits || []).map((rateLimit) => ({
                                ...rateLimit,
                                name: `${manifestId}_tenant_${rateLimit.name || 'default'}`
                            }));
                            rateLimits.push(...appManifestRateLimits);
                        }
                    }
                    else {
                        await manifestService.loadManifest(configService.get('paths').manifestFile);
                        const appManifest = manifestService.getAppManifest();
                        rateLimits.push(...(appManifest.settings.rateLimits || []));
                    }
                    return rateLimits;
                },
                inject: [config_1.ConfigService, manifest_service_1.ManifestService, entity_loader_service_1.EntityLoaderService]
            }),
            manifest_module_1.ManifestModule,
            entity_module_1.EntityModule,
            seed_module_1.SeedModule,
            crud_module_1.CrudModule,
            auth_module_1.AuthModule,
            logger_module_1.LoggerModule,
            health_module_1.HealthModule,
            open_api_module_1.OpenApiModule,
            validation_module_1.ValidationModule,
            upload_module_1.UploadModule,
            storage_module_1.StorageModule,
            hook_module_1.HookModule,
            endpoint_module_1.EndpointModule,
            policy_module_1.PolicyModule,
            handler_module_1.HandlerModule,
            sdk_module_1.SdkModule,
            middleware_module_1.MiddlewareModule,
            event_module_1.EventModule,
            config_1.ConditionalModule.registerWhen(core_1.RouterModule.register([
                {
                    path: ':tenantId',
                    module: auth_module_1.AuthModule
                },
                {
                    path: ':tenantId',
                    module: manifest_module_1.ManifestModule
                },
                {
                    path: ':tenantId',
                    module: crud_module_1.CrudModule
                },
                {
                    path: ':tenantId',
                    module: endpoint_module_1.EndpointModule
                }
            ]), (env) => env['SHOULD_PREFIX_TABLE'] === 'true' ||
                env['IS_MULTI_TENANT'] === 'true')
        ],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: tenant_based_throttler_guard_1.TenantBasedThrottlerGuard
            }
        ]
    }),
    __metadata("design:paramtypes", [logger_service_1.LoggerService])
], AppModule);
