"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.crudEvents = void 0;
exports.crudEvents = [
    {
        name: 'beforeCreate',
        relatedFunctions: ['store'],
        moment: 'before'
    },
    {
        name: 'afterCreate',
        relatedFunctions: ['store'],
        moment: 'after'
    },
    {
        name: 'beforeUpdate',
        relatedFunctions: ['put', 'patch'],
        moment: 'before'
    },
    {
        name: 'afterUpdate',
        relatedFunctions: ['put', 'patch'],
        moment: 'after'
    },
    {
        name: 'beforeDelete',
        relatedFunctions: ['delete'],
        moment: 'before'
    },
    {
        name: 'afterDelete',
        relatedFunctions: ['delete'],
        moment: 'after'
    }
];
