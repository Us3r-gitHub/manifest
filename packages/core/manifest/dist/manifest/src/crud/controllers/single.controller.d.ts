import { AuthService } from '../../auth/auth.service';
import { Request } from 'express';
import { CrudService } from '../services/crud.service';
import { BaseEntity } from '@repo/types';
export declare class SingleController {
    private readonly authService;
    private readonly crudService;
    constructor(authService: AuthService, crudService: CrudService);
    findOne(entitySlug: string, req: Request): Promise<BaseEntity>;
    put(entitySlug: string, itemDto: Partial<BaseEntity>, req: Request): Promise<BaseEntity>;
    patch(entitySlug: string, itemDto: Partial<BaseEntity>, req: Request): Promise<BaseEntity>;
}
