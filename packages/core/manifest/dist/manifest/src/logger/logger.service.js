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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const chalk_1 = __importDefault(require("chalk"));
const constants_1 = require("../constants");
let LoggerService = class LoggerService {
    constructor(configService) {
        this.configService = configService;
    }
    initMessage() {
        const baseUrl = this.configService.get('baseUrl');
        const nodeEnv = this.configService.get('nodeEnv');
        const adminUrl = nodeEnv === 'contribution' ? 'http://localhost:4200' : `${baseUrl}`;
        console.log('');
        console.log(chalk_1.default.green('┌─────────────────────────────────────────────────────────────┐'));
        console.log(chalk_1.default.green('│                   ') +
            chalk_1.default.green.bold('MANIFEST BACKEND STARTED') +
            chalk_1.default.green('                  │'));
        console.log(chalk_1.default.green('└─────────────────────────────────────────────────────────────┘'));
        console.log('');
        if (!this.configService.get('hideAdminPanel')) {
            console.log(chalk_1.default.green('🖥️  ') +
                chalk_1.default.bold('Admin Panel: ') +
                chalk_1.default.cyan.underline(adminUrl));
        }
        if (this.configService.get('showOpenApiDocs')) {
            console.log(chalk_1.default.green('📚 ') +
                chalk_1.default.bold('API Documentation: ') +
                chalk_1.default.cyan.underline(`${baseUrl}/${constants_1.API_PATH}`));
        }
        console.log('');
        console.log(chalk_1.default.yellow('🚀 ') + chalk_1.default.dim('Ready to create and ship fast!'));
        console.log('');
    }
};
exports.LoggerService = LoggerService;
exports.LoggerService = LoggerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LoggerService);
