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
exports.MiddlewareInterceptor = void 0;
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const event_service_1 = require("../event/event.service");
const entity_manifest_service_1 = require("../manifest/services/entity-manifest.service");
const handler_service_1 = require("../handler/handler.service");
let MiddlewareInterceptor = class MiddlewareInterceptor {
    constructor(eventService, entityManifestService, handlerService) {
        this.eventService = eventService;
        this.entityManifestService = entityManifestService;
        this.handlerService = handlerService;
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
            for (const middleware of entityManifest.middlewares?.[beforeRequestEvent] || []) {
                await this.handlerService.trigger({
                    path: middleware.handler,
                    req: context.switchToHttp().getRequest(),
                    res: context.switchToHttp().getResponse()
                });
            }
        }
        return next.handle().pipe((0, rxjs_1.tap)(async () => {
            if (afterRequestEvent) {
                for (const middleware of entityManifest.middlewares?.[afterRequestEvent] || []) {
                    await this.handlerService.trigger({
                        path: middleware.handler,
                        req: context.switchToHttp().getRequest(),
                        res: context.switchToHttp().getResponse()
                    });
                }
            }
        }));
    }
};
exports.MiddlewareInterceptor = MiddlewareInterceptor;
exports.MiddlewareInterceptor = MiddlewareInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [event_service_1.EventService,
        entity_manifest_service_1.EntityManifestService,
        handler_service_1.HandlerService])
], MiddlewareInterceptor);
