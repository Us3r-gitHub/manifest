import { UploadService } from '../services/upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: any, entity: string, property: string): Promise<{
        path: string;
    }>;
    uploadImage(image: any, entity: string, property: string): Promise<{
        [key: string]: string;
    }>;
}
