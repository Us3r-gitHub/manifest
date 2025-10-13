import { EntityManifest, PolicyManifest } from '@repo/types';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { OpenApiUtilsService } from './open-api-utils.service';
export declare class OpenApiCrudService {
    private readonly openApiUtilsService;
    constructor(openApiUtilsService: OpenApiUtilsService);
    generateEntityPaths(entityManifests: EntityManifest[]): Record<string, PathItemObject>;
    generateListPath(entityManifest: EntityManifest): PathItemObject;
    generateListSelectOptionsPath(entityManifest: EntityManifest): PathItemObject;
    generateCreatePath(entityManifest: EntityManifest): PathItemObject;
    generateDetailPath(entityManifest: EntityManifest, single?: boolean): PathItemObject;
    generateUpdatePath(entityManifest: EntityManifest, single?: boolean): PathItemObject;
    generatePatchPath(entityManifest: EntityManifest, single?: boolean): PathItemObject;
    generateDeletePath(entityManifest: EntityManifest): PathItemObject;
    isNotForbidden(policies: PolicyManifest[]): boolean;
    private generateFilterParameters;
}
