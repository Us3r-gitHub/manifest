"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROP_TYPE_VALID_WHERE_OPERATORS = void 0;
exports.isValidWhereOperator = isValidWhereOperator;
exports.getValidWhereOperators = getValidWhereOperators;
const src_1 = require("../../../../types/src");
exports.PROP_TYPE_VALID_WHERE_OPERATORS = {
    [src_1.PropType.String]: [
        src_1.WhereOperator.Equal,
        src_1.WhereOperator.NotEqual,
        src_1.WhereOperator.Like,
        src_1.WhereOperator.In
    ],
    [src_1.PropType.Text]: [
        src_1.WhereOperator.Equal,
        src_1.WhereOperator.NotEqual,
        src_1.WhereOperator.Like,
        src_1.WhereOperator.In
    ],
    [src_1.PropType.RichText]: [
        src_1.WhereOperator.Equal,
        src_1.WhereOperator.NotEqual,
        src_1.WhereOperator.Like,
        src_1.WhereOperator.In
    ],
    [src_1.PropType.Email]: [
        src_1.WhereOperator.Equal,
        src_1.WhereOperator.NotEqual,
        src_1.WhereOperator.Like,
        src_1.WhereOperator.In
    ],
    [src_1.PropType.Link]: [
        src_1.WhereOperator.Equal,
        src_1.WhereOperator.NotEqual,
        src_1.WhereOperator.Like,
        src_1.WhereOperator.In
    ],
    [src_1.PropType.Number]: [
        src_1.WhereOperator.Equal,
        src_1.WhereOperator.NotEqual,
        src_1.WhereOperator.GreaterThan,
        src_1.WhereOperator.GreaterThanOrEqual,
        src_1.WhereOperator.LessThan,
        src_1.WhereOperator.LessThanOrEqual,
        src_1.WhereOperator.In
    ],
    [src_1.PropType.Money]: [
        src_1.WhereOperator.Equal,
        src_1.WhereOperator.NotEqual,
        src_1.WhereOperator.GreaterThan,
        src_1.WhereOperator.GreaterThanOrEqual,
        src_1.WhereOperator.LessThan,
        src_1.WhereOperator.LessThanOrEqual,
        src_1.WhereOperator.In
    ],
    [src_1.PropType.Date]: [
        src_1.WhereOperator.Equal,
        src_1.WhereOperator.NotEqual,
        src_1.WhereOperator.GreaterThan,
        src_1.WhereOperator.GreaterThanOrEqual,
        src_1.WhereOperator.LessThan,
        src_1.WhereOperator.LessThanOrEqual,
        src_1.WhereOperator.In
    ],
    [src_1.PropType.Timestamp]: [
        src_1.WhereOperator.Equal,
        src_1.WhereOperator.NotEqual,
        src_1.WhereOperator.GreaterThan,
        src_1.WhereOperator.GreaterThanOrEqual,
        src_1.WhereOperator.LessThan,
        src_1.WhereOperator.LessThanOrEqual,
        src_1.WhereOperator.In
    ],
    [src_1.PropType.Boolean]: [src_1.WhereOperator.Equal, src_1.WhereOperator.NotEqual],
    [src_1.PropType.Choice]: [
        src_1.WhereOperator.Equal,
        src_1.WhereOperator.NotEqual,
        src_1.WhereOperator.In
    ],
    [src_1.PropType.Location]: [src_1.WhereOperator.Equal, src_1.WhereOperator.NotEqual],
    [src_1.PropType.File]: [
        src_1.WhereOperator.Equal,
        src_1.WhereOperator.NotEqual,
        src_1.WhereOperator.Like,
        src_1.WhereOperator.In
    ],
    [src_1.PropType.Image]: [],
    [src_1.PropType.Password]: [],
    [src_1.PropType.Nested]: []
};
function isValidWhereOperator(propType, operator) {
    return exports.PROP_TYPE_VALID_WHERE_OPERATORS[propType].includes(operator);
}
function getValidWhereOperators(propType) {
    return exports.PROP_TYPE_VALID_WHERE_OPERATORS[propType];
}
