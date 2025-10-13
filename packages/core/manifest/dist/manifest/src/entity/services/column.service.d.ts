import { DatabaseConnection, PropType } from '../../../../types/src';
import { ColumnType } from 'typeorm';
export declare class ColumnService {
    static getColumnTypes(dbConnection: DatabaseConnection): Record<PropType, ColumnType>;
    static getColumnType(dbConnection: DatabaseConnection, propType: PropType): ColumnType;
}
