"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tsTypeSchemaTypes = void 0;
exports.tsTypeSchemaTypes = {
    string: { type: 'string' },
    number: { type: 'integer' },
    boolean: { type: 'boolean' },
    Date: { type: 'string', format: 'date' },
    '{[key:string]: string}': {
        type: 'object',
        additionalProperties: { type: 'string', format: 'uri' }
    },
    '{ lat: number; lng: number }': {
        type: 'object',
        properties: {
            lat: { type: 'number', format: 'float' },
            lng: { type: 'number', format: 'float' }
        },
        required: ['lat', 'lng']
    }
};
