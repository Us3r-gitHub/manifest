"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeValidators = void 0;
const types_1 = require("../../../../types/src");
const class_validator_1 = require("class-validator");
exports.typeValidators = {
    [types_1.PropType.String]: (value) => (0, class_validator_1.isString)(value) ? null : 'The value must be a string',
    [types_1.PropType.Number]: (value) => (0, class_validator_1.isNumber)(value) ? null : 'The value must be a number',
    [types_1.PropType.Link]: (value) => (0, class_validator_1.isURL)(value) ? null : 'The value must be a valid URL',
    [types_1.PropType.Text]: (value) => (0, class_validator_1.isString)(value) ? null : 'The value must be a string',
    [types_1.PropType.RichText]: (value) => (0, class_validator_1.isString)(value) ? null : 'The value must be a string',
    [types_1.PropType.Money]: (value) => typeof value === 'number' && /^\d+(\.\d{1,2})?$/.test(value.toString())
        ? null
        : 'The value must be a number with up to 2 decimal places',
    [types_1.PropType.Date]: (value) => (0, class_validator_1.isDateString)(value) && new RegExp(/^\d{4}-\d{2}-\d{2}$/).test(value)
        ? null
        : 'The value must be a valid date',
    [types_1.PropType.Timestamp]: (value) => (0, class_validator_1.isISO8601)(value) ? null : 'The value must be a valid ISO 8601 timestamp',
    [types_1.PropType.Email]: (value) => (0, class_validator_1.isEmail)(value) ? null : 'The value must be a valid email address',
    [types_1.PropType.Boolean]: (value) => (0, class_validator_1.isBoolean)(value) ? null : 'The value must be a boolean',
    [types_1.PropType.Password]: (value) => (0, class_validator_1.isString)(value) ? null : 'The value must be a string',
    [types_1.PropType.Choice]: (value, options) => (0, class_validator_1.isIn)(value, options.values)
        ? null
        : 'The value must be one of the available choices',
    [types_1.PropType.Location]: (value) => typeof value.lat !== 'undefined' &&
        typeof value.lng !== 'undefined' &&
        (0, class_validator_1.isLatLong)(`${value.lat},${value.lng}`)
        ? null
        : 'The value must be a valid latitude and longitude',
    [types_1.PropType.File]: () => null,
    [types_1.PropType.Image]: () => null,
    [types_1.PropType.Nested]: () => null
};
