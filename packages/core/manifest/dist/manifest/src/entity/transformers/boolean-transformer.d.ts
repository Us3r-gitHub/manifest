import { ValueTransformer } from 'typeorm';
import { DatabaseConnection } from '../../../../types/src';
export declare class BooleanTransformer implements ValueTransformer {
    private connection;
    constructor(connection: DatabaseConnection);
    to(value: boolean): number | boolean;
    from(value: number | boolean): boolean;
}
