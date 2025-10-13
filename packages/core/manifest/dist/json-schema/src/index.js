"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const entity_schema_json_1 = __importDefault(require("./schema/definitions/entity-schema.json"));
const property_options_schema_json_1 = __importDefault(require("./schema/definitions/property-options-schema.json"));
const choice_options_schema_json_1 = __importDefault(require("./schema/definitions/property-options/choice-options-schema.json"));
const money_options_schema_json_1 = __importDefault(require("./schema/definitions/property-options/money-options-schema.json"));
const image_options_schema_json_1 = __importDefault(require("./schema/definitions/property-options/image-options-schema.json"));
const property_schema_json_1 = __importDefault(require("./schema/definitions/property-schema.json"));
const relationship_schema_json_1 = __importDefault(require("./schema/definitions/relationship-schema.json"));
const validation_schema_json_1 = __importDefault(require("./schema/definitions/validation-schema.json"));
const schema_json_1 = __importDefault(require("./schema/schema.json"));
const policies_schema_json_1 = __importDefault(require("./schema/definitions/policies/policies-schema.json"));
const policy_schema_json_1 = __importDefault(require("./schema/definitions/policies/policy-schema.json"));
const hooks_schema_json_1 = __importDefault(require("./schema/definitions/hooks/hooks-schema.json"));
const hook_schema_json_1 = __importDefault(require("./schema/definitions/hooks/hook-schema.json"));
const endpoint_schema_json_1 = __importDefault(require("./schema/definitions/endpoint-schema.json"));
const middleware_schema_json_1 = __importDefault(require("./schema/definitions/middlewares/middleware-schema.json"));
const middlewares_schema_json_1 = __importDefault(require("./schema/definitions/middlewares/middlewares-schema.json"));
const settings_schema_json_1 = __importDefault(require("./schema/definitions/settings-schema.json"));
const group_schema_json_1 = __importDefault(require("./schema/definitions/group-schema.json"));
const group_options_schema_json_1 = __importDefault(require("./schema/definitions/property-options/group-options-schema.json"));
exports.default = [
    schema_json_1.default,
    entity_schema_json_1.default,
    property_schema_json_1.default,
    relationship_schema_json_1.default,
    validation_schema_json_1.default,
    property_options_schema_json_1.default,
    choice_options_schema_json_1.default,
    money_options_schema_json_1.default,
    image_options_schema_json_1.default,
    group_options_schema_json_1.default,
    policies_schema_json_1.default,
    policy_schema_json_1.default,
    hooks_schema_json_1.default,
    hook_schema_json_1.default,
    middlewares_schema_json_1.default,
    middleware_schema_json_1.default,
    endpoint_schema_json_1.default,
    group_schema_json_1.default,
    settings_schema_json_1.default
];
