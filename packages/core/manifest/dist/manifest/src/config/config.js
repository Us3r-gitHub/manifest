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
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const constants_1 = require("../constants");
exports.default = () => {
    const projectRoot = process.env.NODE_ENV === 'contribution'
        ? `${process.cwd()}/manifest`
        : process.env.NODE_ENV === 'test'
            ? `${process.cwd()}/e2e/manifest`
            : process.cwd();
    const generatedFolder = path.join(projectRoot, constants_1.GENERATED_FOLDER_PATH);
    const manifestFolder = process.env.MANIFEST_FOLDER || path.join(projectRoot, 'manifests');
    return {
        port: process.env.PORT || constants_1.DEFAULT_PORT,
        nodeEnv: process.env.NODE_ENV || 'development',
        tokenSecretKey: process.env.TOKEN_SECRET_KEY || constants_1.DEFAULT_TOKEN_SECRET_KEY,
        baseUrl: process.env.BASE_URL ||
            `http://localhost:${process.env.PORT || constants_1.DEFAULT_PORT}`,
        showOpenApiDocs: process.env.OPEN_API_DOCS === 'true' ||
            process.env.NODE_ENV !== 'production',
        hideAdminPanel: process.env.HIDE_ADMIN_PANEL === 'true',
        isMultiTenant: process.env.SHOULD_PREFIX_TABLE === 'true' ||
            process.env.IS_MULTI_TENANT === 'true',
        shouldPrefixTable: process.env.SHOULD_PREFIX_TABLE === 'true',
        manifestFiles: collectManifests(manifestFolder).map((manifestId) => path.join(manifestFolder, manifestId, 'manifest.yml')),
        paths: {
            manifestFile: process.env.MANIFEST_FILE_PATH || `${projectRoot}/manifest.yml`,
            adminPanelFolder: process.env.NODE_ENV === 'contribution'
                ? path.join(process.cwd(), '..', 'admin', 'dist')
                : `${process.cwd()}/node_modules/manifest/dist/admin`,
            publicFolder: process.env.PUBLIC_FOLDER || `${projectRoot}/public`,
            projectRoot: projectRoot,
            generatedFolder: generatedFolder,
            handlersFolder: process.env.MANIFEST_HANDLERS_FOLDER ||
                path.join(projectRoot, 'handlers'),
            manifestFolder: manifestFolder
        },
        database: {
            connection: process.env.NEON_DB === 'true' ? 'postgres' : process.env.DB_CONNECTION,
            sqlite: (manifestFolder) => getSqliteConnectionOptions(generatedFolder, manifestFolder),
            postgres: getPostgresConnectionOptions(),
            mysql: getMysqlConnectionOptions()
        },
        storage: {
            s3Bucket: process.env.S3_BUCKET,
            s3Endpoint: process.env.S3_ENDPOINT,
            s3Region: process.env.S3_REGION,
            s3AccessKeyId: process.env.S3_ACCESS_KEY_ID,
            s3SecretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
            s3FolderPrefix: process.env.S3_FOLDER_PREFIX
        }
    };
};
function collectManifests(manifestFolder) {
    if (!fs.existsSync(manifestFolder))
        fs.mkdirSync(manifestFolder, { recursive: true });
    return fs.readdirSync(manifestFolder);
}
function getSqliteConnectionOptions(generatedFolder, manifestFolder) {
    return {
        type: 'sqlite',
        database: process.env.DB_PATH || manifestFolder
            ? path.join(generatedFolder, manifestFolder, 'db.sqlite')
            : path.join(generatedFolder, 'db.sqlite'),
        dropSchema: process.env.DB_DROP_SCHEMA === 'true' || false,
        synchronize: true
    };
}
function getPostgresConnectionOptions() {
    if (process.env.NEON_DB === 'true')
        return {
            type: 'postgres',
            url: process.env.NEON_DB_URL,
            ssl: true,
            dropSchema: process.env.DB_DROP_SCHEMA === 'true' || false,
            synchronize: true
        };
    return {
        type: 'postgres',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 5432,
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_DATABASE || 'manifest',
        dropSchema: process.env.DB_DROP_SCHEMA === 'true' || false,
        ssl: process.env.DB_SSL === 'true'
            ? {
                rejectUnauthorized: false,
                requestCert: true
            }
            : false,
        synchronize: true
    };
}
function getMysqlConnectionOptions() {
    return {
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT, 10) || 3306,
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_DATABASE || 'manifest',
        dropSchema: process.env.DB_DROP_SCHEMA === 'true' || false,
        ssl: process.env.DB_SSL === 'true'
            ? {
                rejectUnauthorized: false,
                requestCert: true
            }
            : false,
        synchronize: true
    };
}
