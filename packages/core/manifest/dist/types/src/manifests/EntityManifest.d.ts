import { HookManifest } from '../hooks';
import { MiddlewareManifest } from '../middlewares';
import { PolicyManifest } from './PolicyManifest';
import { PropertyManifest } from './PropertyManifest';
import { RelationshipManifest } from './RelationshipManifest';
export interface EntityManifest {
    className: string;
    nameSingular: string;
    namePlural: string;
    slug: string;
    mainProp: string;
    seedCount?: number;
    authenticable?: boolean;
    single?: boolean;
    properties: PropertyManifest[];
    relationships: RelationshipManifest[];
    policies: {
        create: PolicyManifest[];
        read: PolicyManifest[];
        update: PolicyManifest[];
        delete: PolicyManifest[];
        signup: PolicyManifest[];
    };
    hooks?: {
        beforeCreate?: HookManifest[];
        afterCreate?: HookManifest[];
        beforeUpdate?: HookManifest[];
        afterUpdate?: HookManifest[];
        beforeDelete?: HookManifest[];
        afterDelete?: HookManifest[];
    };
    middlewares?: {
        beforeCreate?: MiddlewareManifest[];
        afterCreate?: MiddlewareManifest[];
        beforeUpdate?: MiddlewareManifest[];
        afterUpdate?: MiddlewareManifest[];
        beforeDelete?: MiddlewareManifest[];
        afterDelete?: MiddlewareManifest[];
    };
    nested?: boolean;
}
