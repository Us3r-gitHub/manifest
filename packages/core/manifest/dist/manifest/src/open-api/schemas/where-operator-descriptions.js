"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHERE_OPERATOR_DESCRIPTIONS = void 0;
const src_1 = require("../../../../types/src");
exports.WHERE_OPERATOR_DESCRIPTIONS = {
    [src_1.WhereOperator.Equal]: (entity, property) => `Get ${entity} where ${property} equals the specified value`,
    [src_1.WhereOperator.NotEqual]: (entity, property) => `Get ${entity} where ${property} does not equal the specified value`,
    [src_1.WhereOperator.GreaterThan]: (entity, property) => `Get ${entity} where ${property} is greater than the specified value`,
    [src_1.WhereOperator.GreaterThanOrEqual]: (entity, property) => `Get ${entity} where ${property} is greater than or equal to the specified value`,
    [src_1.WhereOperator.LessThan]: (entity, property) => `Get ${entity} where ${property} is less than the specified value`,
    [src_1.WhereOperator.LessThanOrEqual]: (entity, property) => `Get ${entity} where ${property} is less than or equal to the specified value`,
    [src_1.WhereOperator.Like]: (entity, property) => `Get ${entity} where ${property} contains or matches the specified pattern (use % for wildcards)`,
    [src_1.WhereOperator.In]: (entity, property) => `Get ${entity} where ${property} is one of the specified values (comma-separated)`
};
