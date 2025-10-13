"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolicyService = void 0;
const common_1 = require("@nestjs/common");
let PolicyService = class PolicyService {
    transformPolicies(policySchemas, defaultPolicy) {
        if (!policySchemas?.length) {
            return [defaultPolicy];
        }
        return policySchemas.map((policySchema) => {
            let access;
            switch (policySchema.access) {
                case '🌐':
                    access = 'public';
                    break;
                case '🔒':
                    access = 'restricted';
                    break;
                case '️👨🏻‍💻':
                    access = 'admin';
                    break;
                case '🚫':
                    access = 'forbidden';
                    break;
                default:
                    access = policySchema.access;
            }
            const policyManifest = {
                access
            };
            if (policySchema.allow) {
                policyManifest.allow =
                    typeof policySchema.allow === 'string'
                        ? [policySchema.allow]
                        : policySchema.allow;
            }
            if (policySchema.condition) {
                policyManifest.condition = policySchema.condition;
            }
            return policyManifest;
        });
    }
};
exports.PolicyService = PolicyService;
exports.PolicyService = PolicyService = __decorate([
    (0, common_1.Injectable)()
], PolicyService);
