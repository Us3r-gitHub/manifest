import { CollectionController } from '../crud/controllers/collection.controller';
import { SingleController } from '../crud/controllers/single.controller';
import { CrudEventName } from '../../../types/src';
export declare class EventService {
    getRelatedCrudEvent(functionCalled: keyof CollectionController | keyof SingleController, moment: 'before' | 'after'): CrudEventName;
}
