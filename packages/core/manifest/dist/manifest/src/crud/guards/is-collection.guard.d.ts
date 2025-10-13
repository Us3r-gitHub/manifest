import { CanActivate, ExecutionContext } from '@nestjs/common';
import { EntityManifestService } from '../../manifest/services/entity-manifest.service';
export declare class IsCollectionGuard implements CanActivate {
    private readonly entityManifestService;
    constructor(entityManifestService: EntityManifestService);
    canActivate(context: ExecutionContext): boolean;
}
