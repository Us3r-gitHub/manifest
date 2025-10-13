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
exports.ValidationService = void 0;
const types_1 = require("../../../../types/src");
const common_1 = require("@nestjs/common");
const type_validators_1 = require("../records/type-validators");
const custom_validators_1 = require("../records/custom-validators");
const entity_manifest_service_1 = require("../../manifest/services/entity-manifest.service");
let ValidationService = class ValidationService {
    constructor(entityManifestService) {
        this.entityManifestService = entityManifestService;
    }
    validate(itemDto, entityManifest, options) {
        const errors = [];
        if (options?.isUpdate) {
            entityManifest.properties
                .filter((p) => p.type === types_1.PropType.Password)
                .forEach((p) => {
                p.validation.isOptional = true;
            });
        }
        entityManifest.properties.forEach((propertyManifest) => {
            const propValue = itemDto[propertyManifest.name];
            errors.push(...this.validateProperty(propValue, propertyManifest));
        });
        if (entityManifest.relationships) {
            for (const relationshipManifest of entityManifest.relationships.filter((r) => r.nested)) {
                const nestedEntityManifest = this.entityManifestService.getEntityManifest({
                    className: relationshipManifest.entity,
                    includeNested: true
                });
                if (relationshipManifest.type === 'one-to-many') {
                    const propValue = itemDto[relationshipManifest.name];
                    if (Array.isArray(propValue) && propValue.length > 0) {
                        for (let i = 0; i < propValue.length; i++) {
                            const item = propValue[i];
                            const nestedErrors = this.validate(item, nestedEntityManifest);
                            nestedErrors.forEach((err) => {
                                errors.push({
                                    ...err,
                                    property: `${relationshipManifest.name}[${i}].${err.property}`
                                });
                            });
                        }
                    }
                }
                else {
                    const propValue = itemDto[relationshipManifest.name];
                    if (propValue !== undefined && propValue !== null) {
                        const nestedErrors = this.validate(propValue, nestedEntityManifest);
                        nestedErrors.forEach((err) => {
                            errors.push({
                                ...err,
                                property: `${relationshipManifest.name}.${err.property}`
                            });
                        });
                    }
                }
            }
        }
        return errors;
    }
    validateProperty(propValue, propertyManifest) {
        const errors = [];
        if (typeof propValue !== 'undefined' && propValue !== null) {
            const typeValidationError = type_validators_1.typeValidators[propertyManifest.type](propValue, propertyManifest.options);
            if (typeValidationError) {
                errors.push({
                    property: propertyManifest.name,
                    value: propValue,
                    constraints: {
                        type: typeValidationError
                    }
                });
            }
        }
        Object.entries(propertyManifest.validation || {}).forEach(([key, context]) => {
            let validationError;
            if (propertyManifest.validation.isOptional &&
                (propValue === undefined || propValue === null)) {
                validationError = null;
            }
            else {
                validationError = custom_validators_1.customValidators[key](propValue, context);
            }
            if (validationError) {
                const existingPropertyError = errors.find((error) => error.property === propertyManifest.name);
                if (existingPropertyError) {
                    existingPropertyError.constraints = {
                        ...existingPropertyError.constraints,
                        [key]: validationError
                    };
                }
                else {
                    errors.push({
                        property: propertyManifest.name,
                        value: propValue,
                        constraints: {
                            [key]: validationError
                        }
                    });
                }
            }
        });
        return errors;
    }
};
exports.ValidationService = ValidationService;
exports.ValidationService = ValidationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [entity_manifest_service_1.EntityManifestService])
], ValidationService);
