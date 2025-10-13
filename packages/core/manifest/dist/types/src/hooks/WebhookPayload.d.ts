import { CrudEventName } from '../crud';
export interface WebhookPayload {
    event: CrudEventName;
    createdAt: Date;
    entity: string;
    record: object;
}
