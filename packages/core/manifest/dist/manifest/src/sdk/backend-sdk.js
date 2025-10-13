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
exports.BackendSDK = void 0;
const common_1 = require("@nestjs/common");
const crud_service_1 = require("../crud/services/crud.service");
const constants_1 = require("../constants");
const common_2 = require("../../../common/src");
const upload_service_1 = require("../upload/services/upload.service");
let BackendSDK = class BackendSDK extends common_2.BaseSDK {
    constructor(crudService, uploadService) {
        super();
        this.crudService = crudService;
        this.uploadService = uploadService;
    }
    single(slug) {
        this.slug = slug;
        this.isSingleEntity = true;
        this.queryParams = {};
        return {
            get: async () => {
                return this.crudService.findOne({
                    entitySlug: this.slug,
                    fullVersion: true
                });
            },
            update: async (data) => {
                return this.crudService.update({
                    entitySlug: this.slug,
                    itemDto: data
                });
            },
            patch: async (data) => {
                return this.crudService.update({
                    entitySlug: this.slug,
                    itemDto: data,
                    partialReplacement: true
                });
            }
        };
    }
    async find(paginationParams) {
        return this.crudService.findAll({
            entitySlug: this.slug,
            queryParams: {
                ...this.queryParams,
                page: paginationParams?.page.toString() || '1',
                perPage: paginationParams?.perPage.toString() ||
                    constants_1.DEFAULT_RESULTS_PER_PAGE.toString()
            }
        });
    }
    async findOneById(id) {
        return this.crudService.findOne({
            entitySlug: this.slug,
            queryParams: this.queryParams,
            id,
            fullVersion: true
        });
    }
    async create(itemDto) {
        return this.crudService.store(this.slug, itemDto);
    }
    async update(id, itemDto) {
        return this.crudService.update({
            entitySlug: this.slug,
            id,
            itemDto: itemDto
        });
    }
    async patch(id, itemDto) {
        return this.crudService.update({
            entitySlug: this.slug,
            id,
            itemDto: itemDto,
            partialReplacement: true
        });
    }
    async delete(id) {
        return this.crudService.delete(this.slug, id);
    }
    upload(property, file) {
        return this.uploadService.storeFile({
            file,
            property,
            entity: this.slug
        });
    }
    async uploadImage(property, image) {
        return this.uploadService.storeImage({
            image,
            entity: this.slug,
            property
        });
    }
};
exports.BackendSDK = BackendSDK;
exports.BackendSDK = BackendSDK = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [crud_service_1.CrudService,
        upload_service_1.UploadService])
], BackendSDK);
