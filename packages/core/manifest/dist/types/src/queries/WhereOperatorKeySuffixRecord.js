"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whereOperatorKeySuffix = void 0;
const WhereKeySuffix_1 = require("./WhereKeySuffix");
const WhereOperator_1 = require("./WhereOperator");
exports.whereOperatorKeySuffix = {
    [WhereOperator_1.WhereOperator.Equal]: WhereKeySuffix_1.WhereKeySuffix.Equal,
    [WhereOperator_1.WhereOperator.NotEqual]: WhereKeySuffix_1.WhereKeySuffix.NotEqual,
    [WhereOperator_1.WhereOperator.GreaterThan]: WhereKeySuffix_1.WhereKeySuffix.GreaterThan,
    [WhereOperator_1.WhereOperator.GreaterThanOrEqual]: WhereKeySuffix_1.WhereKeySuffix.GreaterThanOrEqual,
    [WhereOperator_1.WhereOperator.LessThan]: WhereKeySuffix_1.WhereKeySuffix.LessThan,
    [WhereOperator_1.WhereOperator.LessThanOrEqual]: WhereKeySuffix_1.WhereKeySuffix.LessThanOrEqual,
    [WhereOperator_1.WhereOperator.Like]: WhereKeySuffix_1.WhereKeySuffix.Like,
    [WhereOperator_1.WhereOperator.In]: WhereKeySuffix_1.WhereKeySuffix.In
};
