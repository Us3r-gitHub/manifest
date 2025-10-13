import { AppManifest, EntityManifest } from '@repo/types';
import { Request } from 'express';
import { AuthService } from '../../auth/auth.service';
import { ManifestService } from '../services/manifest.service';
import { EntityManifestService } from '../services/entity-manifest.service';
export declare class ManifestController {
    private manifestService;
    private entityManifestService;
    private authService;
    constructor(manifestService: ManifestService, entityManifestService: EntityManifestService, authService: AuthService);
    getAppName(): Promise<{
        name: string;
    }>;
    getAppManifest(tenantId: string): Promise<AppManifest>;
    getEntityManifest(entitySlug: string, req: Request): Promise<EntityManifest>;
}
