import { PolicyManifest, PolicySchema } from '../../../types/src';
export declare class PolicyService {
    transformPolicies(policySchemas: PolicySchema[], defaultPolicy: PolicyManifest): PolicyManifest[];
}
