import { CrudEventName } from '@repo/types';
import { CollectionController } from '../crud/controllers/collection.controller';
import { SingleController } from '../crud/controllers/single.controller';
export declare const crudEvents: {
    name: CrudEventName;
    relatedFunctions: (keyof CollectionController | keyof SingleController)[];
    moment: 'before' | 'after';
}[];
