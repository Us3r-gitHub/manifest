import { EntityManifest, EntitySchema, CrudEventName, HookManifest, HooksSchema, MiddlewaresSchema, MiddlewareManifest, GroupSchema } from '@repo/types';
import { RelationshipManifestService } from './relationship-manifest.service';
import { ManifestService } from './manifest.service';
import { HookService } from '../../hook/hook.service';
import { PolicyService } from '../../policy/policy.service';
import { PropertyManifestService } from './property-manifest.service';
export declare class EntityManifestService {
    private relationshipManifestService;
    private manifestService;
    private propertyManifestService;
    private hookService;
    private policyService;
    constructor(relationshipManifestService: RelationshipManifestService, manifestService: ManifestService, propertyManifestService: PropertyManifestService, hookService: HookService, policyService: PolicyService);
    getEntityManifests(options?: {
        fullVersion?: boolean;
    }): EntityManifest[];
    getEntityManifest({ className, slug, fullVersion, includeNested }: {
        className?: string;
        slug?: string;
        fullVersion?: boolean;
        includeNested?: boolean;
    }): EntityManifest;
    transformEntityManifests({ entities, groups, prefix }: {
        entities: {
            [k: string]: EntitySchema;
        };
        groups?: {
            [k: string]: GroupSchema;
        };
        prefix?: string;
    }): EntityManifest[];
    private getCollectionEntityManifestProps;
    private getSingleEntityManifestProps;
    transformHookObject(hooksSchema: HooksSchema): Record<CrudEventName, HookManifest[]>;
    transformMiddlewareObject(middlewareSchema: MiddlewaresSchema): Record<CrudEventName, MiddlewareManifest[]>;
    hideEntitySensitiveInformation(entityManifest: EntityManifest): EntityManifest;
}
