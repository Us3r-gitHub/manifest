"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenApiAuthService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../constants");
let OpenApiAuthService = class OpenApiAuthService {
    constructor() { }
    generateAuthPaths(entityManifests) {
        const paths = {};
        const authenticableEntities = entityManifests
            .filter((entity) => entity.authenticable)
            .concat(constants_1.ADMIN_ENTITY_MANIFEST);
        const successfulAuthResponse = {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        token: {
                            type: 'string'
                        }
                    }
                },
                example: {
                    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJlbnRpdHlTbHVnIjoidHJhaW5lcnMiLCJpYXQiOjE3NTA4NjUyNjB9.8KRlyPPlNWvHDc_yaocqrqYBhAzAyn5PvyCKyvUUCM4'
                }
            }
        };
        authenticableEntities.forEach((entity) => {
            paths[`/auth/${entity.slug}/login`] = {
                post: {
                    summary: `Login as a ${entity.nameSingular}`,
                    description: `Logs in as a ${entity.nameSingular}.`,
                    tags: ['Auth'],
                    requestBody: {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        email: {
                                            type: 'string'
                                        },
                                        password: {
                                            type: 'string'
                                        }
                                    },
                                    required: ['email', 'password']
                                },
                                example: {
                                    email: 'example@manifest.build',
                                    password: 'password'
                                }
                            }
                        }
                    },
                    responses: {
                        '200': {
                            description: 'Successful login',
                            content: successfulAuthResponse
                        },
                        '401': {
                            description: 'Invalid credentials',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            statusCode: {
                                                type: 'number'
                                            },
                                            message: {
                                                type: 'string'
                                            }
                                        }
                                    },
                                    example: {
                                        message: 'Invalid email or password',
                                        statusCode: 401
                                    }
                                }
                            }
                        },
                        '400': {
                            description: 'Bad request',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            statusCode: {
                                                type: 'number'
                                            },
                                            message: {
                                                type: 'array',
                                                items: {
                                                    type: 'string'
                                                }
                                            },
                                            error: {
                                                type: 'string'
                                            }
                                        }
                                    },
                                    example: {
                                        message: ['password should not be empty'],
                                        statusCode: 400,
                                        error: 'Bad Request'
                                    }
                                }
                            }
                        }
                    }
                }
            };
            paths[`/auth/${entity.slug}/me`] = {
                get: {
                    summary: `Get current ${entity.nameSingular}`,
                    description: `Get current ${entity.nameSingular}.`,
                    tags: ['Auth'],
                    security: [
                        {
                            [entity.className]: []
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'Successful request',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: `#/components/schemas/${entity.className}`
                                    }
                                }
                            }
                        },
                        '403': {
                            description: 'Forbidden',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            statusCode: {
                                                type: 'number'
                                            },
                                            message: {
                                                type: 'string'
                                            },
                                            error: {
                                                type: 'string'
                                            }
                                        }
                                    },
                                    example: {
                                        message: 'Forbidden resource',
                                        error: 'Forbidden',
                                        statusCode: 403
                                    }
                                }
                            }
                        }
                    }
                }
            };
            if (entity.policies.signup.every((policy) => policy.access === 'public')) {
                paths[`/auth/${entity.slug}/signup`] = {
                    post: {
                        summary: `Signup as ${entity.nameSingular}`,
                        description: `Signs up as ${entity.nameSingular}.`,
                        tags: ['Auth'],
                        requestBody: {
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            email: {
                                                type: 'string'
                                            },
                                            password: {
                                                type: 'string'
                                            }
                                        },
                                        required: ['email', 'password']
                                    },
                                    example: {
                                        email: 'user@example.com',
                                        password: 'password'
                                    }
                                }
                            }
                        },
                        responses: {
                            '200': {
                                description: 'Successful signup',
                                content: successfulAuthResponse
                            },
                            '400': {
                                description: 'Bad request',
                                content: {
                                    'application/json': {
                                        schema: {
                                            type: 'object',
                                            properties: {
                                                statusCode: {
                                                    type: 'number'
                                                },
                                                message: {
                                                    type: 'array',
                                                    items: {
                                                        type: 'string'
                                                    }
                                                },
                                                error: {
                                                    type: 'string'
                                                }
                                            }
                                        },
                                        example: {
                                            message: ['password should not be empty'],
                                            statusCode: 400,
                                            error: 'Bad Request'
                                        }
                                    }
                                }
                            }
                        }
                    }
                };
            }
        });
        return paths;
    }
    getSecuritySchemes(appManifest) {
        const securitySchemes = {};
        securitySchemes['Admin'] = {
            type: 'http',
            scheme: 'bearer',
            name: 'Admin auth',
            bearerFormat: 'JWT',
            description: 'Authentication for Admin entity. Use POST /auth/admins/login to get a token.'
        };
        const authenticableEntities = Object.values(appManifest.entities).filter((entity) => entity.authenticable);
        authenticableEntities.forEach((entity) => {
            securitySchemes[`${entity.className}`] = {
                type: 'http',
                scheme: 'bearer',
                name: `${entity.className} auth`,
                bearerFormat: 'JWT',
                description: `Authentication for ${entity.nameSingular} entity. Use POST /auth/${entity.slug}/login to get a token.`
            };
        });
        return securitySchemes;
    }
};
exports.OpenApiAuthService = OpenApiAuthService;
exports.OpenApiAuthService = OpenApiAuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OpenApiAuthService);
