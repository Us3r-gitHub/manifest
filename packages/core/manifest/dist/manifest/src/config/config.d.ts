import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
declare const _default: () => {
    port: number | string;
    nodeEnv: string;
    tokenSecretKey: string;
    baseUrl: string;
    showOpenApiDocs: boolean;
    hideAdminPanel: boolean;
    isMultiTenant: boolean;
    shouldPrefixTable: boolean;
    manifestFiles: string[];
    paths: {
        manifestFile: string;
        adminPanelFolder: string;
        publicFolder: string;
        projectRoot: string;
        manifestFolder: string;
        generatedFolder: string;
        handlersFolder: string;
    };
    database: {
        sqlite: (manifestFolder?: string) => SqliteConnectionOptions;
        postgres: PostgresConnectionOptions;
        mysql: MysqlConnectionOptions;
    };
    storage: {
        s3Bucket: string;
        s3Endpoint: string;
        s3Region: string;
        s3AccessKeyId: string;
        s3SecretAccessKey: string;
        s3FolderPrefix?: string;
    };
};
export default _default;
