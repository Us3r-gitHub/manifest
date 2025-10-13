declare const _default: ({
    $schema: string;
    $id: string;
    title: string;
    description: string;
    type: string;
    properties: {};
} | {
    $schema: string;
    $id: string;
    title: string;
    description: string;
    anyOf: ({
        type: string;
        properties: {
            name: {
                description: string;
                type: string;
            };
            type: {
                description: string;
                type: string;
                enum: string[];
            };
            helpText: {
                description: string;
                type: string;
            };
            validation: {
                description: string;
                $ref: string;
            };
            default: {
                description: string;
                type: string[];
            };
            hidden: {
                description: string;
                type: string;
            };
            options: {
                allOf: {
                    $ref: string;
                }[];
                oneOf: {
                    if: {
                        type: string;
                        properties: {
                            type: {
                                const: string;
                            };
                        };
                    };
                    then: {
                        $ref: string;
                    };
                }[];
            };
        };
        required: string[];
        additionalProperties: boolean;
        description?: undefined;
    } | {
        type: string;
        description: string;
        properties?: undefined;
        required?: undefined;
        additionalProperties?: undefined;
    })[];
} | {
    $schema: string;
    $id: string;
    title: string;
    description: string;
    anyOf: ({
        type: string;
        properties: {
            name: {
                type: string;
                description: string;
            };
            entity: {
                type: string;
                description: string;
            };
            eager: {
                type: string;
                description: string;
            };
            helpText: {
                description: string;
                type: string;
            };
        };
        required: string[];
        additionalProperties: boolean;
        description?: undefined;
    } | {
        type: string;
        description: string;
        properties?: undefined;
        required?: undefined;
        additionalProperties?: undefined;
    })[];
})[];
export default _default;
