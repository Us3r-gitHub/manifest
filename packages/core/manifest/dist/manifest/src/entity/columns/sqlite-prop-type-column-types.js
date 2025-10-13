"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sqlitePropTypeColumnTypes = void 0;
const types_1 = require("../../../../types/src");
exports.sqlitePropTypeColumnTypes = {
    [types_1.PropType.String]: 'varchar',
    [types_1.PropType.Number]: 'decimal',
    [types_1.PropType.Link]: 'varchar',
    [types_1.PropType.Text]: 'text',
    [types_1.PropType.RichText]: 'text',
    [types_1.PropType.Money]: 'decimal',
    [types_1.PropType.Date]: 'date',
    [types_1.PropType.Timestamp]: 'datetime',
    [types_1.PropType.Email]: 'varchar',
    [types_1.PropType.Boolean]: 'boolean',
    [types_1.PropType.Password]: 'varchar',
    [types_1.PropType.Choice]: 'simple-enum',
    [types_1.PropType.Location]: 'json',
    [types_1.PropType.File]: 'varchar',
    [types_1.PropType.Image]: 'json',
    [types_1.PropType.Nested]: 'varchar'
};
