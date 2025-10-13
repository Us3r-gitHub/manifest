"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaService = void 0;
const common_1 = require("@nestjs/common");
const ajv_1 = __importDefault(require("ajv"));
const json_schema_1 = __importDefault(require("../../../../json-schema/src"));
const chalk_1 = __importDefault(require("chalk"));
let SchemaService = class SchemaService {
    validate(manifest) {
        this.validateAgainstSchema(manifest, json_schema_1.default[0]);
        this.validateCustomLogic(manifest);
        return true;
    }
    validateAgainstSchema(manifest, schema) {
        let validate = new ajv_1.default({
            schemas: json_schema_1.default,
            allowUnionTypes: true
        });
        validate = validate.getSchema(schema.$id);
        const valid = validate(manifest);
        if (!valid) {
            console.log(chalk_1.default.red('JSON Schema Validation failed. Please fix the following:'));
            validate.errors.forEach((error) => {
                console.log(chalk_1.default.red(JSON.stringify(error, null, 2)));
            });
            process.exit(1);
        }
        return true;
    }
    validateCustomLogic(manifest) {
        const entityNames = Object.keys(manifest.entities || {});
        const groupNames = Object.keys(manifest.groups || {});
        Object.entries(manifest.entities || {}).forEach(([entityName, entity]) => {
            const relationshipNames = Object.values(entity.belongsTo || []).map((relationship) => {
                if (typeof relationship === 'string') {
                    return relationship;
                }
                return relationship.entity;
            });
            const uniqueRelationshipNames = new Set(relationshipNames);
            if (uniqueRelationshipNames.size !== relationshipNames.length) {
                this.logValidationError(`Entity ${entityName} has duplicate relationship names : ${relationshipNames.join(', ')}`);
            }
            relationshipNames.forEach((relationship) => {
                if (!entityNames.includes(relationship)) {
                    this.logValidationError(`Entity ${relationship} in relationships does not exist`);
                }
            });
            this.flattenPolicies(entity.policies).forEach((policySchema) => {
                if (!policySchema.allow) {
                    return;
                }
                if (typeof policySchema.allow === 'string') {
                    policySchema.allow = [policySchema.allow];
                }
                policySchema.allow.forEach((allowedEntityName) => {
                    if (!entityNames.includes(allowedEntityName)) {
                        this.logValidationError(`Entity ${allowedEntityName} in policies does not exist`);
                    }
                });
            });
            const groupProperties = entity.properties
                .filter((property) => typeof property !== 'string')
                .filter((property) => property['options']?.group);
            groupProperties.forEach((property) => {
                const propertyGroup = property.options?.group;
                if (propertyGroup && !groupNames.includes(propertyGroup)) {
                    this.logValidationError(`Group ${propertyGroup} does not exist`);
                }
            });
        });
        this.validateManyToManyOwnership(manifest.entities || {});
        Object.values(manifest.groups || {}).forEach((group) => {
            group.properties.forEach((property) => {
                if (typeof property === 'string') {
                    return;
                }
                if (property.type === 'group') {
                    this.logValidationError(`Groups cannot have nested group properties.`);
                }
            });
        });
        return true;
    }
    logValidationError(message) {
        console.log('');
        console.log(chalk_1.default.red('┌─────────────────────────────────────────────────────────────┐'));
        console.log(chalk_1.default.red('│                      ') +
            chalk_1.default.red.bold('VALIDATION FAILED') +
            chalk_1.default.red('                      │'));
        console.log(chalk_1.default.red('└─────────────────────────────────────────────────────────────┘'));
        console.log('');
        console.log(chalk_1.default.red('❌ ') + chalk_1.default.bold('Error: ') + chalk_1.default.white(message));
        console.log('');
        console.log(chalk_1.default.yellow('💡 ') +
            chalk_1.default.dim('Please fix the above issue and try again.'));
        console.log('');
        process.exit(1);
    }
    flattenPolicies(policies) {
        const result = [];
        const keys = [
            'create',
            'read',
            'update',
            'delete',
            'signup'
        ];
        keys.forEach((key) => {
            if (policies?.[key]) {
                result.push(...policies[key]);
            }
        });
        return result;
    }
    validateManyToManyOwnership(entities) {
        const manyToManyPairs = new Set();
        Object.entries(entities).forEach(([entityName, entity]) => {
            if (!entity.belongsToMany) {
                return;
            }
            entity.belongsToMany.forEach((relationship) => {
                const targetEntity = typeof relationship === 'string'
                    ? relationship
                    : relationship.entity;
                const pairKey = [entityName, targetEntity].sort().join('|');
                if (manyToManyPairs.has(pairKey)) {
                    this.logValidationError(`Many-to-many relationship between ${entityName} and ${targetEntity} is declared on both entities. Only one entity should declare the belongsToMany relationship (the owning side).`);
                }
                manyToManyPairs.add(pairKey);
            });
        });
    }
};
exports.SchemaService = SchemaService;
exports.SchemaService = SchemaService = __decorate([
    (0, common_1.Injectable)()
], SchemaService);
