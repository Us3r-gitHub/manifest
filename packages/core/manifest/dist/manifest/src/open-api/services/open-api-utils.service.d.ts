import { PolicyManifest } from '../../../../types/src';
import { SecurityRequirementObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
export declare class OpenApiUtilsService {
    getSecurityRequirements(policies: PolicyManifest[]): SecurityRequirementObject[];
}
