import { AppManifest, EntityManifest } from '@repo/types';
import { PathItemObject, SecuritySchemeObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
export declare class OpenApiAuthService {
    constructor();
    generateAuthPaths(entityManifests: EntityManifest[]): Record<string, PathItemObject>;
    getSecuritySchemes(appManifest: AppManifest): Record<string, SecuritySchemeObject>;
}
