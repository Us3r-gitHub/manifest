"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rule = void 0;
const common_1 = require("@nestjs/common");
const Rule = (rule) => (0, common_1.SetMetadata)('rule', rule);
exports.Rule = Rule;
