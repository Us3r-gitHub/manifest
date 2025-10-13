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
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const entity_manifest_service_1 = require("../../manifest/services/entity-manifest.service");
const storage_service_1 = require("../../storage/services/storage.service");
let UploadService = class UploadService {
    constructor(storageService, entityManifestService) {
        this.storageService = storageService;
        this.entityManifestService = entityManifestService;
    }
    storeFile({ file, entity, property }) {
        if (!file) {
            throw new common_1.HttpException('File should be provided', 400);
        }
        if (!entity || !property) {
            throw new common_1.HttpException('Entity name and property should be provided', 400);
        }
        return this.storageService.store(entity, property, file);
    }
    storeImage({ image, entity, property }) {
        if (!image) {
            throw new common_1.HttpException('Image should be provided', 400);
        }
        if (!entity || !property) {
            throw new common_1.HttpException('Entity name and property should be provided', 400);
        }
        const entityManifest = this.entityManifestService.getEntityManifest({
            slug: entity,
            includeNested: true
        });
        const propertyManifest = entityManifest.properties.find((prop) => prop.name === property);
        if (!propertyManifest) {
            throw new common_1.HttpException(`Property ${property} does not exist on entity ${entity}`, 400);
        }
        if (propertyManifest.type !== 'image') {
            throw new common_1.HttpException(`Property ${property} is not an image property`, 400);
        }
        return this.storageService.storeImage(entity, property, image, propertyManifest.options.sizes);
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [storage_service_1.StorageService,
        entity_manifest_service_1.EntityManifestService])
], UploadService);
