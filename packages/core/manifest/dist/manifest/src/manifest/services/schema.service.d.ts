import { Manifest } from '@repo/types';
export declare class SchemaService {
    validate(manifest: Manifest): boolean;
    validateAgainstSchema(manifest: Manifest, schema: any): boolean;
    validateCustomLogic(manifest: Manifest): boolean;
    logValidationError(message: string): void;
    private flattenPolicies;
    private validateManyToManyOwnership;
}
