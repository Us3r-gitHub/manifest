"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantBasedThrottlerGuard = void 0;
const common_1 = require("@nestjs/common");
const throttler_1 = require("@nestjs/throttler");
let TenantBasedThrottlerGuard = class TenantBasedThrottlerGuard extends throttler_1.ThrottlerGuard {
    async handleRequest(requestProps) {
        const { context, limit, ttl, throttler, blockDuration, getTracker, generateKey } = requestProps;
        let manifestId = 'manifest', throttlerName = throttler.name;
        const { req, res } = this.getRequestResponse(context);
        const { tenantId } = req.params;
        if (tenantId) {
            ;
            [manifestId, throttlerName] = throttler.name.split('_tenant_');
            if (tenantId !== manifestId)
                return true;
        }
        const ignoreUserAgents = throttler.ignoreUserAgents ?? this.commonOptions.ignoreUserAgents;
        if (Array.isArray(ignoreUserAgents)) {
            for (const pattern of ignoreUserAgents) {
                if (pattern.test(req.headers['user-agent'])) {
                    return true;
                }
            }
        }
        const tracker = await getTracker(req, context);
        const key = generateKey(context, tracker, throttler.name);
        const { totalHits, timeToExpire, isBlocked, timeToBlockExpire } = await this.storageService.increment(key, ttl, limit, blockDuration, throttler.name);
        const getThrottlerSuffix = (name) => name === 'default' ? '' : `-${name}`;
        if (isBlocked) {
            res.header(`Retry-After${getThrottlerSuffix(throttlerName)}`, timeToBlockExpire);
            await this.throwThrottlingException(context, {
                limit,
                ttl,
                key,
                tracker,
                totalHits,
                timeToExpire,
                isBlocked,
                timeToBlockExpire
            });
        }
        res.header(`${this.headerPrefix}-Limit${getThrottlerSuffix(throttlerName)}`, limit);
        res.header(`${this.headerPrefix}-Remaining${getThrottlerSuffix(throttlerName)}`, Math.max(0, limit - totalHits));
        res.header(`${this.headerPrefix}-Reset${getThrottlerSuffix(throttlerName)}`, timeToExpire);
        return true;
    }
};
exports.TenantBasedThrottlerGuard = TenantBasedThrottlerGuard;
exports.TenantBasedThrottlerGuard = TenantBasedThrottlerGuard = __decorate([
    (0, common_1.Injectable)()
], TenantBasedThrottlerGuard);
