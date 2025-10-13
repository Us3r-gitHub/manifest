import { CrudService } from '../crud/services/crud.service';
import { BaseEntity, Paginator } from '@repo/types';
import { BaseSDK } from '@repo/common';
import { UploadService } from '../upload/services/upload.service';
export declare class BackendSDK extends BaseSDK {
    private crudService;
    private uploadService;
    constructor(crudService: CrudService, uploadService: UploadService);
    single(slug: string): {
        get: <T>() => Promise<T>;
        update: <T>(data: unknown) => Promise<T>;
        patch: <T>(data: unknown) => Promise<T>;
    };
    find<T>(paginationParams?: {
        page?: number;
        perPage?: number;
    }): Promise<Paginator<T>>;
    findOneById<T>(id: string): Promise<T>;
    create<T>(itemDto: unknown): Promise<T>;
    update<T>(id: string, itemDto: unknown): Promise<T>;
    patch<T>(id: string, itemDto: unknown): Promise<T>;
    delete(id: string): Promise<BaseEntity>;
    upload(property: string, file: {
        buffer: Buffer;
        originalname: string;
    }): Promise<string>;
    uploadImage(property: string, image: {
        buffer: Buffer;
        originalname: string;
    }): Promise<{
        [key: string]: string;
    }>;
}
