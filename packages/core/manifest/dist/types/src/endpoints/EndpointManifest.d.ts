import { HttpMethod } from '../common/HttpMethod';
import { PolicyManifest } from '../manifests';
export interface EndpointManifest {
    name: string;
    path: string;
    method: HttpMethod;
    description: string;
    handler: string;
    policies: PolicyManifest[];
}
