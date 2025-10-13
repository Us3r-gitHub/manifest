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
exports.EndpointService = void 0;
const common_1 = require("@nestjs/common");
const path_to_regexp_1 = require("path-to-regexp");
const policy_service_1 = require("../policy/policy.service");
const constants_1 = require("../constants");
let EndpointService = class EndpointService {
    constructor(policyService) {
        this.policyService = policyService;
    }
    transformEndpointsSchemaObject(endpointSchemaObject) {
        return Object.keys(endpointSchemaObject || []).map((endpointName) => {
            const endpointSchema = endpointSchemaObject[endpointName];
            return {
                name: endpointName,
                path: endpointSchema.path,
                description: endpointSchema.description ||
                    `Endpoint for ${endpointName} handler`,
                method: endpointSchema.method,
                policies: this.policyService.transformPolicies(endpointSchema.policies, constants_1.PUBLIC_ACCESS_POLICY),
                handler: endpointSchema.handler
            };
        });
    }
    matchRoutePath({ path, method, endpoints }) {
        for (const endpoint of endpoints) {
            const matcher = (0, path_to_regexp_1.match)(endpoint.path);
            const result = matcher(path);
            if (result && endpoint.method === method) {
                return {
                    endpoint,
                    params: result?.params || {}
                };
            }
        }
        return { endpoint: null, params: {} };
    }
};
exports.EndpointService = EndpointService;
exports.EndpointService = EndpointService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [policy_service_1.PolicyService])
], EndpointService);
