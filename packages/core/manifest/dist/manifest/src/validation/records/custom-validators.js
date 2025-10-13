"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customValidators = void 0;
const class_validator_1 = require("class-validator");
exports.customValidators = {
    min: (propValue, minValue) => (0, class_validator_1.min)(propValue, minValue)
        ? null
        : `The value must be greater than or equal to ${minValue}`,
    max: (propValue, maxValue) => (0, class_validator_1.max)(propValue, maxValue)
        ? null
        : `The value must be less than or equal to ${maxValue}`,
    isEmpty: (propValue, isFilterActive) => !isFilterActive || (0, class_validator_1.isEmpty)(propValue) ? null : 'The value must be empty',
    isNotEmpty: (propValue, isFilterActive) => !isFilterActive || (0, class_validator_1.isNotEmpty)(propValue)
        ? null
        : 'The value must not be empty',
    required: (propValue, isFilterActive) => !isFilterActive || (0, class_validator_1.isNotEmpty)(propValue) ? null : 'The value is required',
    isDefined: (propValue, isFilterActive) => !isFilterActive || (0, class_validator_1.isDefined)(propValue)
        ? null
        : 'The value must be defined',
    equals: (propValue, comparison) => (0, class_validator_1.equals)(propValue, comparison)
        ? null
        : `The value must be equal to ${comparison}`,
    notEquals: (propValue, comparison) => (0, class_validator_1.notEquals)(propValue, comparison)
        ? null
        : `The value must not be equal to ${comparison}`,
    isIn: (propValue, values) => (0, class_validator_1.isIn)(propValue, values) ? null : `The value must be one of ${values}`,
    isNotIn: (propValue, values) => (0, class_validator_1.isNotIn)(propValue, values)
        ? null
        : `The value must not be one of ${values}`,
    contains: (propValue, seed) => (0, class_validator_1.contains)(propValue, seed) ? null : `The value must contain ${seed}`,
    notContains: (propValue, seed) => (0, class_validator_1.notContains)(propValue, seed) ? null : `The value must not contain ${seed}`,
    isAlpha: (propValue, isFilterActive) => !isFilterActive || (0, class_validator_1.isAlpha)(propValue)
        ? null
        : 'The value must contain only letters (a-zA-Z)',
    isAlphanumeric: (propValue, isFilterActive) => !isFilterActive || (0, class_validator_1.isAlphanumeric)(propValue)
        ? null
        : 'The value must contain only letters and numbers',
    isAscii: (propValue, isFilterActive) => !isFilterActive || (0, class_validator_1.isAscii)(propValue)
        ? null
        : 'The value must contain only ASCII characters',
    isEmail: (propValue, isFilterActive) => !isFilterActive || (0, class_validator_1.isEmail)(propValue)
        ? null
        : 'The value must be a valid email address',
    isJSON: (propValue, isFilterActive) => !isFilterActive || (0, class_validator_1.isJSON)(propValue)
        ? null
        : 'The value must be a valid JSON string',
    minLength: (propValue, min) => (0, class_validator_1.minLength)(propValue, min)
        ? null
        : `The value must be at least ${min} characters long`,
    maxLength: (propValue, max) => (0, class_validator_1.maxLength)(propValue, max)
        ? null
        : `The value must be at most ${max} characters long`,
    matches: (propValue, pattern) => (0, class_validator_1.matches)(propValue, pattern)
        ? null
        : `The value must match the pattern ${pattern}`,
    isOptional: (propValue, context) => null
};
