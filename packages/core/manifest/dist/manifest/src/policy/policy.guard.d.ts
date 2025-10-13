import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';
import { EntityManifestService } from '../manifest/services/entity-manifest.service';
import { EntityService } from '../entity/services/entity.service';
export declare class PolicyGuard implements CanActivate {
    private readonly reflector;
    private readonly entityManifestService;
    private readonly entityService;
    private readonly authService;
    constructor(reflector: Reflector, entityManifestService: EntityManifestService, entityService: EntityService, authService: AuthService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private getCrudPolicies;
}
