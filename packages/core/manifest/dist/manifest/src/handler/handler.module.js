"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandlerModule = void 0;
const common_1 = require("@nestjs/common");
const handler_service_1 = require("./handler.service");
const sdk_module_1 = require("../sdk/sdk.module");
let HandlerModule = class HandlerModule {
};
exports.HandlerModule = HandlerModule;
exports.HandlerModule = HandlerModule = __decorate([
    (0, common_1.Module)({
        imports: [sdk_module_1.SdkModule],
        providers: [handler_service_1.HandlerService],
        exports: [handler_service_1.HandlerService, sdk_module_1.SdkModule]
    })
], HandlerModule);
