"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postgresPropTypeColumnTypes = void 0;
const types_1 = require("../../../../types/src");
exports.postgresPropTypeColumnTypes = {
    [types_1.PropType.String]: 'varchar',
    [types_1.PropType.Number]: 'numeric',
    [types_1.PropType.Link]: 'varchar',
    [types_1.PropType.Text]: 'text',
    [types_1.PropType.RichText]: 'text',
    [types_1.PropType.Money]: 'numeric',
    [types_1.PropType.Date]: 'date',
    [types_1.PropType.Timestamp]: 'timestamp',
    [types_1.PropType.Email]: 'varchar',
    [types_1.PropType.Boolean]: 'boolean',
    [types_1.PropType.Password]: 'varchar',
    [types_1.PropType.Choice]: 'text',
    [types_1.PropType.Location]: 'jsonb',
    [types_1.PropType.File]: 'varchar',
    [types_1.PropType.Image]: 'jsonb',
    [types_1.PropType.Nested]: 'varchar'
};
