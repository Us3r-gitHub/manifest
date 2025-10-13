import { CrudEventName, HookManifest, HookSchema } from '@repo/types';
export declare class HookService {
    transformHookSchemaIntoHookManifest(hookSchema: HookSchema, event: CrudEventName): HookManifest;
    triggerWebhook(hookManifest: HookManifest, entity: string, record: object): Promise<void>;
}
