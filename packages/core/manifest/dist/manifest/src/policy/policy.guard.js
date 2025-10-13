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
exports.PolicyGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const auth_service_1 = require("../auth/auth.service");
const entity_manifest_service_1 = require("../manifest/services/entity-manifest.service");
const policies_1 = require("./policies");
const entity_service_1 = require("../entity/services/entity.service");
let PolicyGuard = class PolicyGuard {
    constructor(reflector, entityManifestService, entityService, authService) {
        this.reflector = reflector;
        this.entityManifestService = entityManifestService;
        this.entityService = entityService;
        this.authService = authService;
    }
    async canActivate(context) {
        const rule = this.reflector.get('rule', context.getHandler());
        if (!rule) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        let routePolicies;
        let entityManifest;
        if (rule === 'dynamic-endpoint') {
            routePolicies = request['endpoint']?.policies || [];
        }
        else {
            routePolicies = await this.getCrudPolicies(rule, request['entityTenant'] || context.getArgs()[0].params.entity);
            entityManifest = this.entityManifestService.getEntityManifest({
                slug: request['entityTenant'] || context.getArgs()[0].params.entity
            });
        }
        const { user, entitySlug: userEntitySlug } = (await this.authService.getUserFromRequest(request)) || {};
        let userEntityManifest;
        if (userEntitySlug) {
            userEntityManifest = this.entityManifestService.getEntityManifest({
                slug: userEntitySlug
            });
        }
        else {
            userEntityManifest = null;
        }
        return Promise.all(routePolicies.map((policy) => {
            const policyFn = policies_1.policies[policy.access];
            return policyFn({
                entityManifest,
                entityRepository: entityManifest
                    ? this.entityService.getEntityRepository({
                        entitySlug: entityManifest.slug
                    })
                    : null,
                user,
                userEntityManifest,
                rule,
                request,
                options: {
                    allow: policy.allow,
                    condition: policy.condition
                }
            });
        }))
            .then((results) => {
            return results.every((result) => result === true);
        })
            .catch(() => {
            return false;
        });
    }
    async getCrudPolicies(rule, entitySlug) {
        const entityManifest = this.entityManifestService.getEntityManifest({ slug: entitySlug });
        return entityManifest.policies[rule];
    }
};
exports.PolicyGuard = PolicyGuard;
exports.PolicyGuard = PolicyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        entity_manifest_service_1.EntityManifestService,
        entity_service_1.EntityService,
        auth_service_1.AuthService])
], PolicyGuard);
