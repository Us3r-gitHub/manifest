import { ImageSizesObject } from '@repo/types';
import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private configService;
    private isS3Enabled;
    private s3Client;
    private s3Endpoint;
    private s3Bucket;
    private s3Region;
    private s3AccessKeyId;
    private s3SecretAccessKey;
    private s3provider;
    private s3FolderPrefix;
    constructor(configService: ConfigService);
    store(entity: string, property: string, file: {
        buffer: Buffer;
        originalname: string;
    }): Promise<string>;
    storeImage(entity: string, property: string, image: {
        buffer: Buffer;
        originalname: string;
    }, imageSizes: ImageSizesObject): Promise<{
        [key: string]: string;
    }>;
    createUploadFolder(entity: string, property: string): string;
    prependStorageUrl(value: string): string;
    private uploadToS3;
}
