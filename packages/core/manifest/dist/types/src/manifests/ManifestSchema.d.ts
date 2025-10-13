export type PropertySchema = {
    name: string;
    type?: 'string' | 'text' | 'richText' | 'number' | 'link' | 'money' | 'date' | 'timestamp' | 'email' | 'boolean' | 'password' | 'choice' | 'location' | 'file' | 'image' | 'group';
    helpText?: string;
    validation?: ValidationSchema;
    default?: string | number | boolean | {
        [k: string]: unknown;
    } | unknown[];
    hidden?: boolean;
    options?: GlobalPropertyOptionsSchema;
} | string;
export type RelationshipSchema = {
    name?: string;
    entity: string;
    eager?: boolean;
    helpText?: string;
} | string;
export interface Manifest {
    name: string;
    version?: string;
    entities?: {
        [k: string]: EntitySchema;
    };
    groups?: {
        [k: string]: GroupSchema;
    };
    endpoints?: {
        [k: string]: EndpointSchema;
    };
    settings?: SettingsSchema;
}
export interface EntitySchema {
    className?: string;
    nameSingular?: string;
    namePlural?: string;
    slug?: string;
    mainProp?: string;
    seedCount?: number;
    authenticable?: boolean;
    single?: boolean;
    properties?: PropertySchema[];
    belongsTo?: RelationshipSchema[];
    belongsToMany?: RelationshipSchema[];
    policies?: PoliciesSchema;
    validation?: {
        '*'?: ValidationSchema1;
        [k: string]: unknown;
    };
    hooks?: HooksSchema;
    middlewares?: MiddlewaresSchema;
}
export interface ValidationSchema {
    isDefined?: boolean;
    isOptional?: boolean;
    equals?: {
        [k: string]: unknown;
    };
    notEquals?: {
        [k: string]: unknown;
    };
    isEmpty?: boolean;
    isNotEmpty?: boolean;
    required?: boolean;
    isIn?: unknown[];
    isNotIn?: unknown[];
    min?: number;
    max?: number;
    contains?: string;
    notContains?: string;
    isAlpha?: boolean;
    isAlphanumeric?: boolean;
    isAscii?: boolean;
    isEmail?: boolean;
    isJSON?: boolean;
    minLength?: number;
    maxLength?: number;
    matches?: string;
}
export interface GlobalPropertyOptionsSchema {
    [k: string]: unknown;
}
export interface PoliciesSchema {
    create?: PolicySchema[];
    read?: PolicySchema[];
    update?: PolicySchema[];
    delete?: PolicySchema[];
    signup?: PolicySchema[];
}
export interface PolicySchema {
    access: 'public' | 'restricted' | 'forbidden' | 'admin' | '🌐' | '🚫' | '🔒' | '️👨🏻‍💻';
    allow?: string | string[];
    condition?: 'self';
}
export interface ValidationSchema1 {
    isDefined?: boolean;
    isOptional?: boolean;
    equals?: {
        [k: string]: unknown;
    };
    notEquals?: {
        [k: string]: unknown;
    };
    isEmpty?: boolean;
    isNotEmpty?: boolean;
    required?: boolean;
    isIn?: unknown[];
    isNotIn?: unknown[];
    min?: number;
    max?: number;
    contains?: string;
    notContains?: string;
    isAlpha?: boolean;
    isAlphanumeric?: boolean;
    isAscii?: boolean;
    isEmail?: boolean;
    isJSON?: boolean;
    minLength?: number;
    maxLength?: number;
    matches?: string;
}
export interface HooksSchema {
    beforeCreate?: HookSchema[];
    afterCreate?: HookSchema[];
    beforeUpdate?: HookSchema[];
    afterUpdate?: HookSchema[];
    beforeDelete?: HookSchema[];
    afterDelete?: HookSchema[];
}
export interface HookSchema {
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    headers?: {
        [k: string]: string;
    };
}
export interface MiddlewaresSchema {
    beforeCreate?: MiddlewareSchema[];
    afterCreate?: MiddlewareSchema[];
    beforeUpdate?: MiddlewareSchema[];
    afterUpdate?: MiddlewareSchema[];
    beforeDelete?: MiddlewareSchema[];
    afterDelete?: MiddlewareSchema[];
}
export interface MiddlewareSchema {
    handler: string;
}
export interface GroupSchema {
    properties?: PropertySchema[];
    validation?: {
        '*'?: ValidationSchema1;
        [k: string]: unknown;
    };
}
export interface EndpointSchema {
    path: string;
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
    handler: string;
    description?: string;
    policies?: PolicySchema1[];
}
export interface PolicySchema1 {
    access: 'public' | 'restricted' | 'forbidden' | 'admin' | '🌐' | '🚫' | '🔒' | '️👨🏻‍💻';
    allow?: string | string[];
    condition?: 'self';
}
export interface SettingsSchema {
    rateLimits?: {
        name?: string;
        limit: number;
        ttl: number;
    }[];
}
