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
exports.OpenApiEndpointService = void 0;
const common_1 = require("@nestjs/common");
const constants_1 = require("../../constants");
const open_api_utils_service_1 = require("./open-api-utils.service");
let OpenApiEndpointService = class OpenApiEndpointService {
    constructor(openApiUtilsService) {
        this.openApiUtilsService = openApiUtilsService;
    }
    generateEndpointPaths(endpoints) {
        const paths = {};
        endpoints.forEach((endpoint) => {
            const path = this.convertRouteParams(`/${constants_1.ENDPOINTS_PATH}${endpoint.path}`);
            paths[path] = {
                [endpoint.method.toLowerCase()]: {
                    summary: endpoint.name,
                    description: endpoint.description,
                    tags: ['Dynamic endpoints'],
                    security: this.openApiUtilsService.getSecurityRequirements(endpoint.policies),
                    parameters: Object.keys(this.extractRouteParams(endpoint.path) || {}).map((paramName) => ({
                        name: paramName,
                        in: 'path',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }))
                }
            };
        });
        return paths;
    }
    convertRouteParams(route) {
        return route.replace(/:(\w+)/g, '{$1}');
    }
    extractRouteParams(route) {
        const params = {};
        const regex = /:(\w+)/g;
        let match;
        while ((match = regex.exec(route)) !== null) {
            params[match[1]] = 'string';
        }
        return params;
    }
};
exports.OpenApiEndpointService = OpenApiEndpointService;
exports.OpenApiEndpointService = OpenApiEndpointService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [open_api_utils_service_1.OpenApiUtilsService])
], OpenApiEndpointService);
