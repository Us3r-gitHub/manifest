"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSDK = void 0;
const types_1 = require("../../../types/src");
class BaseSDK {
    constructor() {
        this.slug = '';
        this.isSingleEntity = false;
        this.queryParams = {};
    }
    from(slug) {
        this.slug = slug;
        this.isSingleEntity = false;
        this.queryParams = {};
        return this;
    }
    where(whereClause) {
        const whereOperator = Object.values(types_1.WhereOperator)
            .reverse()
            .find((operator) => whereClause.includes(` ${operator} `));
        if (!whereOperator) {
            throw new Error(`Invalid where clause. Where clause must include one of the following operators: ${Object.values(types_1.WhereOperator).join(', ')}.`);
        }
        const spacedOperator = ` ${whereOperator} `;
        const [propName, propValue] = whereClause
            .split(spacedOperator)
            .map((str) => str.trim());
        const suffix = types_1.whereOperatorKeySuffix[whereOperator];
        this.queryParams[propName + suffix] = propValue;
        return this;
    }
    andWhere(whereClause) {
        return this.where(whereClause);
    }
    orderBy(propName, order) {
        this.queryParams['orderBy'] = propName;
        this.queryParams['order'] = order?.desc ? 'DESC' : 'ASC';
        return this;
    }
    with(relations) {
        this.queryParams['relations'] = relations.join(',');
        return this;
    }
}
exports.BaseSDK = BaseSDK;
