"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhereOperator = void 0;
var WhereOperator;
(function (WhereOperator) {
    WhereOperator["Equal"] = "=";
    WhereOperator["NotEqual"] = "!=";
    WhereOperator["GreaterThan"] = ">";
    WhereOperator["GreaterThanOrEqual"] = ">=";
    WhereOperator["LessThan"] = "<";
    WhereOperator["LessThanOrEqual"] = "<=";
    WhereOperator["Like"] = "like";
    WhereOperator["In"] = "in";
})(WhereOperator || (exports.WhereOperator = WhereOperator = {}));
