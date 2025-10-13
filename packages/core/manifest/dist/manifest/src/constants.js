"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FORBIDDEN_ACCESS_POLICY = exports.PUBLIC_ACCESS_POLICY = exports.ADMIN_ACCESS_POLICY = exports.QUERY_PARAMS_RESERVED_WORDS = exports.ADMIN_ENTITY_MANIFEST = exports.DEFAULT_ADMIN_CREDENTIALS = exports.TENANT_PROPS = exports.AUTHENTICABLE_PROPS = exports.DEFAULT_IMAGE_SIZES = exports.DEFAULT_TOKEN_SECRET_KEY = exports.DUMMY_IMAGE_NAME = exports.DUMMY_FILE_NAME = exports.DEFAULT_MAX_MANY_TO_MANY_RELATIONS = exports.DEFAULT_SEED_COUNT = exports.SALT_ROUNDS = exports.DEFAULT_RESULTS_PER_PAGE = exports.DEFAULT_PORT = exports.GENERATED_FOLDER_PATH = exports.ENDPOINTS_PATH = exports.SINGLES_PATH = exports.COLLECTIONS_PATH = exports.API_PATH = exports.STORAGE_PATH = void 0;
const types_1 = require("../../types/src");
exports.STORAGE_PATH = 'storage';
exports.API_PATH = 'api';
exports.COLLECTIONS_PATH = 'collections';
exports.SINGLES_PATH = 'singles';
exports.ENDPOINTS_PATH = 'endpoints';
exports.GENERATED_FOLDER_PATH = '.manifest';
exports.DEFAULT_PORT = 1111;
exports.DEFAULT_RESULTS_PER_PAGE = 20;
exports.SALT_ROUNDS = 10;
exports.DEFAULT_SEED_COUNT = 50;
exports.DEFAULT_MAX_MANY_TO_MANY_RELATIONS = 5;
exports.DUMMY_FILE_NAME = 'dummy-invoice.pdf';
exports.DUMMY_IMAGE_NAME = 'dummy-image.jpg';
exports.DEFAULT_TOKEN_SECRET_KEY = 'REPLACE_ME';
exports.DEFAULT_IMAGE_SIZES = {
    thumbnail: {
        width: 80,
        height: 80
    },
    medium: {
        width: 160,
        height: 160
    }
};
exports.AUTHENTICABLE_PROPS = [
    {
        name: 'email',
        type: types_1.PropType.Email,
        hidden: true,
        validation: { isNotEmpty: true }
    },
    {
        name: 'password',
        type: types_1.PropType.Password,
        hidden: true,
        validation: { isNotEmpty: true }
    }
];
exports.TENANT_PROPS = [
    {
        name: 'tenantId',
        type: types_1.PropType.String,
        hidden: true,
        validation: { isNotEmpty: true },
        default: 'default'
    }
];
exports.DEFAULT_ADMIN_CREDENTIALS = {
    email: 'admin@manifest.build',
    password: 'admin'
};
exports.ADMIN_ENTITY_MANIFEST = {
    className: 'Admin',
    mainProp: 'email',
    slug: 'admins',
    authenticable: true,
    nameSingular: 'admin',
    namePlural: 'admins',
    properties: exports.AUTHENTICABLE_PROPS,
    relationships: [],
    policies: {
        create: [{ access: 'admin' }],
        read: [{ access: 'admin' }],
        update: [{ access: 'admin' }],
        delete: [{ access: 'admin' }],
        signup: [{ access: 'forbidden' }]
    }
};
exports.QUERY_PARAMS_RESERVED_WORDS = [
    'page',
    'perPage',
    'order',
    'orderBy',
    'relations'
];
exports.ADMIN_ACCESS_POLICY = { access: 'admin' };
exports.PUBLIC_ACCESS_POLICY = { access: 'public' };
exports.FORBIDDEN_ACCESS_POLICY = { access: 'forbidden' };
