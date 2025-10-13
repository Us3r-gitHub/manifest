import { EndpointManifest } from '../endpoints';
import { AppSettings } from './AppSettings';
import { EntityManifest } from './EntityManifest';
import { AppEnvironment } from '../common';
export interface AppManifest {
    name: string;
    version?: string;
    manifestVersion?: string;
    environment?: AppEnvironment;
    entities?: {
        [k: string]: EntityManifest;
    };
    endpoints?: EndpointManifest[];
    settings?: AppSettings;
    disableTelemetry?: boolean;
}
