import { AppManifest, EntityManifest } from '@repo/types';
export declare function normalizeEntities(entities: AppManifest['entities'], manifestId?: string): {
    [k: string]: EntityManifest;
};
