export declare function getForbiddenResponse(): {
    description: string;
    content: {
        'application/json': {
            schema: {
                type: string;
                properties: {
                    message: {
                        type: string;
                    };
                    error: {
                        type: string;
                    };
                    statusCode: {
                        type: string;
                    };
                };
            };
            example: {
                message: string;
                error: string;
                statusCode: number;
            };
        };
    };
};
