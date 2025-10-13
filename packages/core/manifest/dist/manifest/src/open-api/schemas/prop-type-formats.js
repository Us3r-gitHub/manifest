"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propTypeFormats = void 0;
const src_1 = require("../../../../types/src");
exports.propTypeFormats = {
    [src_1.PropType.String]: null,
    [src_1.PropType.Text]: null,
    [src_1.PropType.RichText]: null,
    [src_1.PropType.Number]: 'float',
    [src_1.PropType.Link]: 'uri',
    [src_1.PropType.Money]: 'double',
    [src_1.PropType.Date]: 'date',
    [src_1.PropType.Timestamp]: 'date-time',
    [src_1.PropType.Email]: 'email',
    [src_1.PropType.Boolean]: null,
    [src_1.PropType.Password]: null,
    [src_1.PropType.Choice]: null,
    [src_1.PropType.Location]: null,
    [src_1.PropType.File]: 'uri',
    [src_1.PropType.Image]: null,
    [src_1.PropType.Nested]: null
};
