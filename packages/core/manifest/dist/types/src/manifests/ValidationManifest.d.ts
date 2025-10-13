import { ValidationSchema } from './ManifestSchema';
export interface ValidationManifest extends ValidationSchema {
    [key: string]: unknown;
}
