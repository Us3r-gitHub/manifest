"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HookService = void 0;
const common_1 = require("@nestjs/common");
let HookService = class HookService {
    transformHookSchemaIntoHookManifest(hookSchema, event) {
        return {
            event,
            type: 'webhook',
            url: hookSchema.url,
            method: hookSchema.method || 'POST',
            headers: hookSchema.headers || {}
        };
    }
    async triggerWebhook(hookManifest, entity, record) {
        const headers = Object.assign({
            'Content-Type': 'application/json'
        }, hookManifest.headers);
        const payload = {
            event: hookManifest.event,
            createdAt: new Date(),
            entity,
            record
        };
        try {
            await fetch(hookManifest.url, {
                method: hookManifest.method,
                headers,
                body: hookManifest.method !== 'GET' ? JSON.stringify(payload) : undefined
            });
        }
        catch {
            console.error(`Failed to trigger webhook "${hookManifest.url}" for event "${hookManifest.event}" (entity: "${entity}").`);
        }
    }
};
exports.HookService = HookService;
exports.HookService = HookService = __decorate([
    (0, common_1.Injectable)()
], HookService);
