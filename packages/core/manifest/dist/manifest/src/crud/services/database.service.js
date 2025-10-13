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
exports.DatabaseService = void 0;
const common_1 = require("@nestjs/common");
const manifest_service_1 = require("../../manifest/services/manifest.service");
const entity_service_1 = require("../../entity/services/entity.service");
const constants_1 = require("../../constants");
let DatabaseService = class DatabaseService {
    constructor(manifestService, entityService) {
        this.manifestService = manifestService;
        this.entityService = entityService;
    }
    async isDbEmpty() {
        const appManifest = this.manifestService.getAppManifest();
        const entities = [
            ...Object.values(appManifest.entities),
            constants_1.ADMIN_ENTITY_MANIFEST
        ];
        let totalItems = 0;
        await Promise.all(Object.values(entities).map(async (entityManifest) => {
            return this.entityService
                .getEntityRepository({
                entitySlug: entityManifest.slug
            })
                .createQueryBuilder('entity')
                .getCount();
        })).then((counts) => {
            totalItems = counts.reduce((acc, count) => acc + count, 0);
        });
        return totalItems === 0;
    }
};
exports.DatabaseService = DatabaseService;
exports.DatabaseService = DatabaseService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [manifest_service_1.ManifestService,
        entity_service_1.EntityService])
], DatabaseService);
