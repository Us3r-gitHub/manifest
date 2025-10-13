import { BaseEntity, Paginator, SelectOption } from '@repo/types';
import { CrudService } from '../services/crud.service';
import { AuthService } from '../../auth/auth.service';
import { Request } from 'express';
export declare class CollectionController {
    private readonly crudService;
    private readonly authService;
    constructor(crudService: CrudService, authService: AuthService);
    findAll(entitySlug: string, queryParams: {
        [key: string]: string | string[];
    }, req: Request): Promise<Paginator<BaseEntity>>;
    findSelectOptions(entitySlug: string, queryParams: {
        [key: string]: string | string[];
    }, req: Request): Promise<SelectOption[]>;
    findOne(entitySlug: string, id: string, queryParams: {
        [key: string]: string | string[];
    }, req: Request): Promise<BaseEntity>;
    store(entitySlug: string, entityDto: Partial<BaseEntity>, req: Request): Promise<BaseEntity>;
    put(entitySlug: string, id: string, itemDto: Partial<BaseEntity>, req: Request): Promise<BaseEntity>;
    patch(entitySlug: string, id: string, itemDto: Partial<BaseEntity>, req: Request): Promise<BaseEntity>;
    delete(entitySlug: string, id: string, req: Request): Promise<BaseEntity>;
}
