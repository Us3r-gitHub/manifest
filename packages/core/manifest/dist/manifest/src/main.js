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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const connect_livereload_1 = __importDefault(require("connect-livereload"));
const express = __importStar(require("express"));
const livereload = __importStar(require("livereload"));
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
const path = __importStar(require("path"));
const app_module_1 = require("./app.module");
const constants_1 = require("./constants");
const open_api_service_1 = require("./open-api/services/open-api.service");
const entity_type_service_1 = require("./entity/services/entity-type.service");
const manifest_service_1 = require("./manifest/services/manifest.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: true,
        logger: ['error', 'warn']
    });
    app.getHttpAdapter().getInstance().disable('x-powered-by');
    const configService = app.get(config_1.ConfigService);
    app.setGlobalPrefix(constants_1.API_PATH);
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.useGlobalPipes(new common_1.ValidationPipe());
    const isProduction = configService.get('NODE_ENV') === 'production';
    const isTest = configService.get('NODE_ENV') === 'test';
    if (isProduction &&
        configService.get('tokenSecretKey') === constants_1.DEFAULT_TOKEN_SECRET_KEY) {
        throw new Error('Token secret key not defined. Please set a custom token secret key to run in production environment adding TOKEN_SECRET_KEY in your env file.');
    }
    if (!isProduction && !isTest) {
        const liveReloadServer = livereload.createServer();
        liveReloadServer.server.once('connection', () => {
            setTimeout(() => {
                liveReloadServer.refresh('/');
            }, 100);
        });
        app.use((0, connect_livereload_1.default)());
    }
    const publicFolder = configService.get('paths').publicFolder;
    const storagePath = path.join(publicFolder, constants_1.STORAGE_PATH);
    app.use(`/${constants_1.STORAGE_PATH}`, express.static(storagePath));
    if (!configService.get('hideAdminPanel')) {
        const adminPanelFolder = configService.get('paths').adminPanelFolder;
        app.use(express.static(adminPanelFolder));
        app.use((req, res, next) => {
            if (req.url.startsWith(`/${constants_1.API_PATH}`) ||
                req.url.startsWith(`/${constants_1.STORAGE_PATH}`)) {
                next();
            }
            else {
                res.sendFile(path.join(adminPanelFolder, 'index.html'));
            }
        });
    }
    function generateOpenAPIType(destinationFolder) {
        const entityTypeService = app.get(entity_type_service_1.EntityTypeService);
        const entityTypeInfos = entityTypeService.generateEntityTypeInfos();
        fs.writeFileSync(`${destinationFolder}/types.ts`, entityTypeInfos
            .map((entityTypeInfo) => entityTypeService.generateTSInterfaceFromEntityTypeInfo(entityTypeInfo))
            .join('\n'), 'utf8');
        return entityTypeInfos;
    }
    function generateOpenAPISpec(entityTypeInfos, destinationFolder, manifestId) {
        const openApiService = app.get(open_api_service_1.OpenApiService);
        const openApiObject = openApiService.generateOpenApiObject(entityTypeInfos);
        swagger_1.SwaggerModule.setup(`${constants_1.API_PATH}${manifestId ? `/${manifestId}` : ''}`, app, openApiObject, {
            customfavIcon: 'assets/images/open-api/favicon.ico',
            customSiteTitle: 'Manifest API Doc',
            customCss: fs.readFileSync(path.join(__dirname, '../../open-api/styles/swagger-custom.css'), 'utf8')
        });
        const yamlString = yaml.dump(openApiObject);
        fs.writeFileSync(`${destinationFolder}/openapi.yml`, yamlString, 'utf8');
    }
    if (configService.get('showOpenApiDocs')) {
        const generatedFolder = configService.get('paths').generatedFolder;
        if (configService.get('isMultiTenant')) {
            const manifestFiles = configService.get('manifestFiles');
            for (const manifestFile of manifestFiles) {
                const manifestId = path.basename(path.dirname(manifestFile));
                const manifestFolder = path.join(generatedFolder, manifestId);
                if (!fs.existsSync(manifestFolder)) {
                    fs.mkdirSync(manifestFolder, { recursive: true });
                }
                const manifestService = app.get(manifest_service_1.ManifestService);
                manifestService.setManifestId(manifestId);
                await manifestService.loadManifest(manifestFile);
                const openApiTypes = generateOpenAPIType(manifestFolder);
                generateOpenAPISpec(openApiTypes, manifestFolder, manifestId);
            }
        }
        else {
            const openApiTypes = generateOpenAPIType(generatedFolder);
            generateOpenAPISpec(openApiTypes, generatedFolder);
        }
    }
    await app.listen(configService.get('PORT') || constants_1.DEFAULT_PORT);
}
bootstrap();
