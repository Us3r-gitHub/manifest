import { SchemaService } from './schema.service';
import { YamlService } from './yaml.service';
import { AppManifest } from '@repo/types';
import { EntityManifestService } from './entity-manifest.service';
import { EndpointService } from '../../endpoint/endpoint.service';
import { ConfigService } from '@nestjs/config';
import { LockFileService } from './lock-file.service';
export declare class ManifestService {
    private yamlService;
    private schemaService;
    private entityManifestService;
    private endpointService;
    private readonly configService;
    private readonly lockFileService;
    private manifestId;
    private appManifests;
    private loadingPromise;
    constructor(yamlService: YamlService, schemaService: SchemaService, entityManifestService: EntityManifestService, endpointService: EndpointService, configService: ConfigService, lockFileService: LockFileService);
    getManifestId(): string;
    setManifestId(manifestId: string): void;
    getAppManifest(options?: {
        fullVersion?: boolean;
    }): AppManifest;
    loadManifest(manifestFilePath: string): Promise<AppManifest>;
    doLoadManifest(manifestFilePath: string): Promise<AppManifest>;
    hideSensitiveInformation(manifest: AppManifest): AppManifest;
}
