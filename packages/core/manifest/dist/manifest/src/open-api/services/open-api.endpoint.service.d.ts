import { EndpointManifest } from '../../../../types/src';
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { OpenApiUtilsService } from './open-api-utils.service';
export declare class OpenApiEndpointService {
    private readonly openApiUtilsService;
    constructor(openApiUtilsService: OpenApiUtilsService);
    generateEndpointPaths(endpoints: EndpointManifest[]): Record<string, PathItemObject>;
    private convertRouteParams;
    private extractRouteParams;
}
