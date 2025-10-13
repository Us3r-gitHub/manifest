"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropertyManifestService = void 0;
const common_1 = require("@nestjs/common");
const types_1 = require("../../../../types/src");
const constants_1 = require("../../constants");
let PropertyManifestService = class PropertyManifestService {
    transformPropertyManifest(propSchema, entitySchema) {
        if (typeof propSchema === 'string') {
            return {
                name: propSchema,
                type: types_1.PropType.String,
                hidden: false,
                validation: entitySchema?.validation?.[propSchema] || {}
            };
        }
        return {
            name: propSchema.name,
            type: propSchema.type || types_1.PropType.String,
            hidden: propSchema.hidden || false,
            options: propSchema.options ||
                (propSchema.type === types_1.PropType.Image
                    ? { sizes: constants_1.DEFAULT_IMAGE_SIZES }
                    : {}),
            validation: Object.assign(entitySchema?.validation?.[propSchema.name] ||
                {}, propSchema.validation),
            helpText: propSchema.helpText || '',
            default: propSchema.default
        };
    }
};
exports.PropertyManifestService = PropertyManifestService;
exports.PropertyManifestService = PropertyManifestService = __decorate([
    (0, common_1.Injectable)()
], PropertyManifestService);
