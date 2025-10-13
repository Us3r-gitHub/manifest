"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadModule = void 0;
const common_1 = require("@nestjs/common");
const upload_controller_1 = require("./controllers/upload.controller");
const manifest_module_1 = require("../manifest/manifest.module");
const storage_module_1 = require("../storage/storage.module");
const upload_service_1 = require("./services/upload.service");
let UploadModule = class UploadModule {
};
exports.UploadModule = UploadModule;
exports.UploadModule = UploadModule = __decorate([
    (0, common_1.Module)({
        imports: [(0, common_1.forwardRef)(() => manifest_module_1.ManifestModule), storage_module_1.StorageModule],
        controllers: [upload_controller_1.UploadController],
        providers: [upload_service_1.UploadService],
        exports: [upload_service_1.UploadService]
    })
], UploadModule);
