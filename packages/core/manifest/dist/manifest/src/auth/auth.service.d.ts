import { AuthenticableEntity } from '@repo/types';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { EntityService } from '../entity/services/entity.service';
import { SignupAuthenticableEntityDto } from './dtos/signup-authenticable-entity.dto';
import { EntityManifestService } from '../manifest/services/entity-manifest.service';
import { CrudService } from '../crud/services/crud.service';
export declare class AuthService {
    private readonly configService;
    private readonly entityService;
    private readonly entityManifestService;
    private readonly crudService;
    constructor(configService: ConfigService, entityService: EntityService, entityManifestService: EntityManifestService, crudService: CrudService);
    includeTenantId(entitySlug: string): boolean;
    createToken(entitySlug: string, signupUserDto: SignupAuthenticableEntityDto): Promise<{
        token: string;
    }>;
    signup(entitySlug: string, signupUserDto: SignupAuthenticableEntityDto, byPassAdminCheck?: boolean): Promise<{
        token: string;
    }>;
    getUserFromToken(token: string): Promise<{
        user: AuthenticableEntity;
        entitySlug: string;
    }>;
    getUserFromRequest(req: Request): Promise<{
        user: AuthenticableEntity;
        entitySlug: string;
    }>;
    isReqUserAdmin(req: Request): Promise<boolean>;
    isDefaultAdminExists(tenantId?: string): Promise<{
        exists: boolean;
    }>;
    findUserFromCredentials(entitySlug: string, email: string, password: string, tenantId?: string): Promise<AuthenticableEntity>;
}
