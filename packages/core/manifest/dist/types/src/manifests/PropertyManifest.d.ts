import { PropType } from '../crud';
import { ValidationManifest } from './ValidationManifest';
export type PropertyManifest = {
    name: string;
    type: PropType;
    hidden?: boolean;
    options?: Record<string, unknown>;
    validation?: ValidationManifest;
    helpText?: string;
    default?: string | number | boolean | Record<string, unknown> | Array<unknown>;
};
