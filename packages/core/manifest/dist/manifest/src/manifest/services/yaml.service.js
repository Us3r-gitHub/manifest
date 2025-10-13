"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.YamlService = void 0;
const common_1 = require("@nestjs/common");
const fs = __importStar(require("fs"));
const yaml = __importStar(require("js-yaml"));
let YamlService = class YamlService {
    async load(manifestFilePath) {
        let fileContent;
        if (manifestFilePath.startsWith('http')) {
            fileContent = await this.loadManifestFromUrl(manifestFilePath);
        }
        else {
            fileContent = fs.readFileSync(manifestFilePath, 'utf8');
        }
        fileContent = this.interpolateDotEnvVariables(fileContent);
        const manifestSchema = yaml.load(fileContent);
        Object.keys(manifestSchema.entities || []).forEach((key) => {
            const newKey = this.ignoreEmojis(key);
            if (newKey !== key) {
                manifestSchema.entities[newKey] = manifestSchema.entities[key];
                delete manifestSchema.entities[key];
            }
        });
        return manifestSchema;
    }
    async loadManifestFromUrl(url) {
        const response = await fetch(url).catch(() => {
            throw new Error(`Failed to fetch the manifest from ${url}`);
        });
        const text = await response.text();
        return text;
    }
    ignoreEmojis(fileContent) {
        const emojiWithSurroundingSpacesRegex = /\s?[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2E00}-\u{2E7F}\u{3000}-\u{303F}\u{FE00}-\u{FE0F}](\s?)/gu;
        return (fileContent || '')
            .replace(emojiWithSurroundingSpacesRegex, '')
            .replace(/[^\w]/g, '')
            .trim();
    }
    interpolateDotEnvVariables(yamlContent) {
        return yamlContent.replace(/\$\{\s*(\w+)\s*}/g, (match, varName) => {
            const value = process.env[varName];
            if (value === undefined) {
                console.warn(`Warning: Environment variable ${varName} is not defined.`);
            }
            return value || match;
        });
    }
};
exports.YamlService = YamlService;
exports.YamlService = YamlService = __decorate([
    (0, common_1.Injectable)()
], YamlService);
