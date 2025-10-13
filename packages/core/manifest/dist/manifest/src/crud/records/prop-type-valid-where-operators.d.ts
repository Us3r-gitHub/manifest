import { PropType, WhereOperator } from '../../../../types/src';
export declare const PROP_TYPE_VALID_WHERE_OPERATORS: Record<PropType, WhereOperator[]>;
export declare function isValidWhereOperator(propType: PropType, operator: WhereOperator): boolean;
export declare function getValidWhereOperators(propType: PropType): WhereOperator[];
