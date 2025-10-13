import { AuthenticableEntity } from '@repo/types';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { SignupAuthenticableEntityDto } from './dtos/signup-authenticable-entity.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getToken(tenantId: string, entitySlug: string, signupUserDto: SignupAuthenticableEntityDto, req: Request): Promise<{
        token: string;
    }>;
    signupAdmin(tenantId: string, signupUserDto: SignupAuthenticableEntityDto): Promise<{
        token: string;
    }>;
    signup(tenantId: string, entitySlug: string, signupUserDto: SignupAuthenticableEntityDto, req: Request): Promise<{
        token: string;
    }>;
    getCurrentUser(req: Request): Promise<AuthenticableEntity>;
    isDefaultAdminExists(tenantId: string): Promise<{
        exists: boolean;
    }>;
}
