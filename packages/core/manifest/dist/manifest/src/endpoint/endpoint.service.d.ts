import { EndpointSchema, EndpointManifest, HttpMethod } from '@repo/types';
import { PolicyService } from '../policy/policy.service';
export declare class EndpointService {
    private readonly policyService;
    constructor(policyService: PolicyService);
    transformEndpointsSchemaObject(endpointSchemaObject: {
        [k: string]: EndpointSchema;
    }): EndpointManifest[];
    matchRoutePath({ path, method, endpoints }: {
        path: string;
        method: HttpMethod;
        endpoints: EndpointManifest[];
    }): {
        endpoint: EndpointManifest;
        params: object;
    };
}
