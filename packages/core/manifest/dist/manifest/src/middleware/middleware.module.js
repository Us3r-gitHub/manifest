"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareModule = void 0;
const common_1 = require("@nestjs/common");
const event_module_1 = require("../event/event.module");
const handler_module_1 = require("../handler/handler.module");
const manifest_module_1 = require("../manifest/manifest.module");
let MiddlewareModule = class MiddlewareModule {
};
exports.MiddlewareModule = MiddlewareModule;
exports.MiddlewareModule = MiddlewareModule = __decorate([
    (0, common_1.Module)({
        imports: [
            event_module_1.EventModule,
            (0, common_1.forwardRef)(() => manifest_module_1.ManifestModule),
            (0, common_1.forwardRef)(() => handler_module_1.HandlerModule)
        ],
        exports: [(0, common_1.forwardRef)(() => handler_module_1.HandlerModule)]
    })
], MiddlewareModule);
