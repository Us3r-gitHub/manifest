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
exports.HookInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const entity_manifest_service_1 = require("../manifest/services/entity-manifest.service");
const hook_service_1 = require("./hook.service");
const event_service_1 = require("../event/event.service");
let HookInterceptor = class HookInterceptor {
    constructor(entityManifestService, hookService, eventService) {
        this.entityManifestService = entityManifestService;
        this.hookService = hookService;
        this.eventService = eventService;
    }
    async intercept(context, next) {
        let entityManifest;
        const beforeRequestEvent = this.eventService.getRelatedCrudEvent(context.getHandler().name, 'before');
        const afterRequestEvent = this.eventService.getRelatedCrudEvent(context.getHandler().name, 'after');
        if (beforeRequestEvent || afterRequestEvent) {
            const request = context.switchToHttp().getRequest();
            entityManifest = this.entityManifestService.getEntityManifest({
                slug: request['entityTenant'] || context.getArgs()[0].params.entity
            });
        }
        if (beforeRequestEvent) {
            if (entityManifest.hooks?.[beforeRequestEvent]?.length) {
                const request = context.switchToHttp().getRequest();
                const entitySlug = request['entityTenant'] || request.params.entity;
                const id = request.params.id;
                let payload = request.body;
                if (!payload && id) {
                    payload = { id };
                }
                await (0, rxjs_1.lastValueFrom)((0, rxjs_1.forkJoin)((entityManifest.hooks?.[beforeRequestEvent] || []).map((hook) => this.hookService.triggerWebhook(hook, entitySlug, payload))));
            }
        }
        return next.handle().pipe((0, rxjs_1.tap)(async (data) => {
            if (afterRequestEvent) {
                if (entityManifest.hooks?.[afterRequestEvent]?.length) {
                    const request = context.switchToHttp().getRequest();
                    const entitySlug = request['entityTenant'] || request.params.entity;
                    await (0, rxjs_1.lastValueFrom)((0, rxjs_1.forkJoin)((entityManifest.hooks?.[afterRequestEvent] || []).map((hook) => this.hookService.triggerWebhook(hook, entitySlug, data))));
                }
            }
        }));
    }
};
exports.HookInterceptor = HookInterceptor;
exports.HookInterceptor = HookInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [entity_manifest_service_1.EntityManifestService,
        hook_service_1.HookService,
        event_service_1.EventService])
], HookInterceptor);
