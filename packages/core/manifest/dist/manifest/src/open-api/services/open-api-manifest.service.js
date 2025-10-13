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
exports.OpenApiManifestService = void 0;
const common_1 = require("@nestjs/common");
const common_response_utils_1 = require("../utils/common-response.utils");
let OpenApiManifestService = class OpenApiManifestService {
    constructor() { }
    generateManifestPaths(entityManifests) {
        const paths = {
            ['/manifest']: {
                get: {
                    summary: 'Get the manifest',
                    description: 'Retrieves the manifest of the application.',
                    tags: ['Manifest'],
                    security: [
                        {
                            Admin: []
                        }
                    ],
                    responses: {
                        '200': {
                            description: 'The manifest of the application.',
                            content: {
                                'application/json': {
                                    schema: {
                                        $ref: '#/components/schemas/AppManifest'
                                    }
                                }
                            }
                        },
                        '403': (0, common_response_utils_1.getForbiddenResponse)()
                    }
                }
            }
        };
        entityManifests.forEach((entityManifest) => {
            paths[`/manifest/entities/${entityManifest.slug}`] =
                this.generateEntityManifestPath(entityManifest);
        });
        return paths;
    }
    generateEntityManifestPath(entityManifest) {
        return {
            get: {
                summary: `Get the ${entityManifest.nameSingular} manifest`,
                description: `Retrieves the manifest of the ${entityManifest.nameSingular} entity with all its properties.`,
                tags: ['Manifest'],
                security: [
                    {
                        Admin: []
                    }
                ],
                responses: {
                    '200': {
                        description: `The manifest of the ${entityManifest.nameSingular} entity.`,
                        content: {
                            'application/json': {
                                schema: {
                                    $ref: '#/components/schemas/EntityManifest'
                                }
                            }
                        }
                    },
                    '403': (0, common_response_utils_1.getForbiddenResponse)()
                }
            }
        };
    }
};
exports.OpenApiManifestService = OpenApiManifestService;
exports.OpenApiManifestService = OpenApiManifestService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], OpenApiManifestService);
