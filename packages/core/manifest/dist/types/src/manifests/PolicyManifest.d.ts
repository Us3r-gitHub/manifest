import { AccessPolicy } from '../crud/AccessPolicy';
export type PolicyManifest = {
    access: AccessPolicy;
    allow?: string[];
    condition?: 'self';
};
