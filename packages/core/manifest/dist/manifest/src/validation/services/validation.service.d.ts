import { EntityManifest, PropertyManifest } from '@repo/types';
import { ValidationError } from 'class-validator';
import { EntityManifestService } from '../../manifest/services/entity-manifest.service';
export declare class ValidationService {
    private entityManifestService;
    constructor(entityManifestService: EntityManifestService);
    validate(itemDto: unknown, entityManifest: EntityManifest, options?: {
        isUpdate?: boolean;
    }): ValidationError[];
    validateProperty(propValue: unknown, propertyManifest: PropertyManifest): ValidationError[];
}
