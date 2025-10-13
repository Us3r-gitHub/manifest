"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propTypeTsType = void 0;
const src_1 = require("../../../../types/src");
exports.propTypeTsType = {
    [src_1.PropType.String]: 'string',
    [src_1.PropType.Text]: 'string',
    [src_1.PropType.RichText]: 'string',
    [src_1.PropType.Number]: 'number',
    [src_1.PropType.Link]: 'string',
    [src_1.PropType.Money]: 'number',
    [src_1.PropType.Date]: 'Date',
    [src_1.PropType.Timestamp]: 'Date',
    [src_1.PropType.Email]: 'string',
    [src_1.PropType.Boolean]: 'boolean',
    [src_1.PropType.Password]: 'string',
    [src_1.PropType.Choice]: 'string',
    [src_1.PropType.Location]: '{ lat: number; lng: number }',
    [src_1.PropType.File]: 'string',
    [src_1.PropType.Image]: 'string',
    [src_1.PropType.Nested]: 'string'
};
