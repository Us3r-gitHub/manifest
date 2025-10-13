import { EntityManifest } from '@repo/types';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
export declare class OpenApiManifestService {
    constructor();
    generateManifestPaths(entityManifests: EntityManifest[]): Record<string, PathItemObject>;
    generateEntityManifestPath(entityManifest: EntityManifest): PathItemObject;
}
