import { EntityManifestService } from '../../manifest/services/entity-manifest.service';
import { StorageService } from '../../storage/services/storage.service';
export declare class UploadService {
    private readonly storageService;
    private readonly entityManifestService;
    constructor(storageService: StorageService, entityManifestService: EntityManifestService);
    storeFile({ file, entity, property }: {
        file: {
            buffer: Buffer;
            originalname: string;
        };
        entity: string;
        property: string;
    }): Promise<string>;
    storeImage({ image, entity, property }: {
        image: {
            buffer: Buffer;
            originalname: string;
        };
        entity: string;
        property: string;
    }): Promise<{
        [key: string]: string;
    }>;
}
