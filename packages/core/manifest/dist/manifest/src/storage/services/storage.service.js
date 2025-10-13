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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common/src");
const constants_1 = require("../../constants");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const mkdirp = __importStar(require("mkdirp"));
const uniqid_1 = __importDefault(require("uniqid"));
const slugify_1 = __importDefault(require("slugify"));
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
let StorageService = class StorageService {
    constructor(configService) {
        this.configService = configService;
        this.isS3Enabled = false;
        this.isS3Enabled = !!this.configService.get('storage.s3Bucket');
        this.s3Endpoint = this.configService.get('storage.s3Endpoint');
        this.s3Bucket = this.configService.get('storage.s3Bucket');
        this.s3Region = this.configService.get('storage.s3Region');
        this.s3AccessKeyId = this.configService.get('storage.s3AccessKeyId');
        this.s3SecretAccessKey = this.configService.get('storage.s3SecretAccessKey');
        this.s3provider = this.s3Endpoint?.includes('amazon')
            ? 'aws'
            : this.s3Endpoint?.includes('digitalocean')
                ? 'digitalocean'
                : 'other';
        this.s3FolderPrefix = this.configService.get('storage.s3FolderPrefix') || '';
        if (this.isS3Enabled) {
            this.s3Client = new client_s3_1.S3Client({
                region: this.s3Region,
                endpoint: this.s3Endpoint,
                credentials: {
                    accessKeyId: this.s3AccessKeyId,
                    secretAccessKey: this.s3SecretAccessKey
                },
                forcePathStyle: false
            });
        }
    }
    store(entity, property, file) {
        const folder = this.createUploadFolder(entity, property);
        const filePath = `${folder}/${(0, uniqid_1.default)()}-${(0, slugify_1.default)(file.originalname)}`;
        if (this.isS3Enabled) {
            return this.uploadToS3(filePath, file.buffer);
        }
        else {
            const publicFolderPath = path.resolve(this.configService.get('paths.publicFolder'), constants_1.STORAGE_PATH, filePath);
            if (!publicFolderPath.startsWith(path.resolve(this.configService.get('paths.publicFolder'), constants_1.STORAGE_PATH))) {
                throw new Error('Invalid file path');
            }
            fs.writeFileSync(publicFolderPath, file.buffer);
            return Promise.resolve(this.prependStorageUrl(filePath));
        }
    }
    async storeImage(entity, property, image, imageSizes) {
        const folder = this.createUploadFolder(entity, property);
        const uniqueName = (0, uniqid_1.default)();
        const imagePaths = {};
        for (const sizeName in imageSizes || constants_1.DEFAULT_IMAGE_SIZES) {
            const imageExtension = path.extname(image.originalname);
            if (['.jpg', '.jpeg', '.png'].indexOf(imageExtension) === -1) {
                throw new common_1.HttpException(`Unsupported image format: ${imageExtension}`, 400);
            }
            const imagePath = `${folder}/${uniqueName}-${sizeName}${imageExtension}`;
            const resizedImageBuffer = await (0, sharp_1.default)(image.buffer)
                .resize(imageSizes[sizeName].width, imageSizes[sizeName].height, {
                fit: imageSizes[sizeName].fit
            })
                .toBuffer();
            if (this.isS3Enabled) {
                imagePaths[sizeName] = await this.uploadToS3(imagePath, resizedImageBuffer);
            }
            else {
                const publicFolderPath = path.resolve(this.configService.get('paths.publicFolder'), constants_1.STORAGE_PATH, imagePath);
                if (!publicFolderPath.startsWith(path.resolve(this.configService.get('paths.publicFolder'), constants_1.STORAGE_PATH))) {
                    throw new Error('Invalid image path');
                }
                fs.writeFileSync(publicFolderPath, resizedImageBuffer);
                imagePaths[sizeName] = this.prependStorageUrl(imagePath);
            }
        }
        return imagePaths;
    }
    createUploadFolder(entity, property) {
        const dateString = new Date().toLocaleString('en-us', { month: 'short' }) +
            new Date().getFullYear();
        const folder = `${(0, common_2.kebabize)(entity)}/${(0, common_2.kebabize)(property)}/${dateString}`;
        if (!this.isS3Enabled) {
            mkdirp.sync(`${this.configService.get('paths.publicFolder')}/${constants_1.STORAGE_PATH}/${folder}`);
        }
        return folder;
    }
    prependStorageUrl(value) {
        return `${this.configService.get('baseUrl')}/${constants_1.STORAGE_PATH}/${value}`;
    }
    async uploadToS3(key, buffer) {
        const path = `${this.s3FolderPrefix}/${key}`;
        await this.s3Client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.s3Bucket,
            Key: path,
            Body: buffer,
            ChecksumAlgorithm: undefined,
            ACL: this.s3provider === 'digitalocean' ? 'public-read' : undefined
        }));
        return `${this.s3Endpoint}/${this.s3Bucket}/${path}`;
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
