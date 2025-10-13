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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LockFileService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
const yaml = __importStar(require("js-yaml"));
const yarnLockfile = __importStar(require("@yarnpkg/lockfile"));
const config_1 = require("@nestjs/config");
let LockFileService = class LockFileService {
    constructor(configService) {
        this.configService = configService;
        this.installedPackages = {};
        this.packageManager = 'unknown';
        this.detectAndParseLockFile();
    }
    detectAndParseLockFile() {
        const rootPath = this.configService.get('paths.projectRoot');
        if ((0, fs_1.existsSync)((0, path_1.join)(rootPath, 'pnpm-lock.yaml'))) {
            this.packageManager = 'pnpm';
            this.parsePnpmLock((0, path_1.join)(rootPath, 'pnpm-lock.yaml'));
        }
        else if ((0, fs_1.existsSync)((0, path_1.join)(rootPath, 'yarn.lock'))) {
            this.packageManager = 'yarn';
            this.parseYarnLock((0, path_1.join)(rootPath, 'yarn.lock'));
        }
        else if ((0, fs_1.existsSync)((0, path_1.join)(rootPath, 'package-lock.json'))) {
            this.packageManager = 'npm';
            this.parseNpmLock((0, path_1.join)(rootPath, 'package-lock.json'));
        }
        else {
            console.warn('No lock file found. Version checking will be limited.');
        }
    }
    parseNpmLock(filePath) {
        try {
            const lockFile = JSON.parse((0, fs_1.readFileSync)(filePath, 'utf8'));
            if (lockFile.packages) {
                Object.entries(lockFile.packages).forEach(([path, info]) => {
                    if (path.startsWith('node_modules/')) {
                        const relativePath = path.replace('node_modules/', '');
                        let packageName;
                        if (relativePath.includes('/node_modules/')) {
                            const parts = relativePath.split('/node_modules/');
                            packageName = this.extractPackageName(parts[parts.length - 1]);
                        }
                        else {
                            packageName = this.extractPackageName(relativePath);
                        }
                        if (!this.installedPackages[packageName]) {
                            this.installedPackages[packageName] = info.version;
                        }
                    }
                    else if (path === '' && info.name) {
                        this.installedPackages[info.name] = info.version;
                    }
                });
            }
            else if (lockFile.dependencies) {
                this.extractFromNpmDependencies(lockFile.dependencies);
            }
        }
        catch (error) {
            console.error('Error parsing npm lock file:', error);
        }
    }
    extractFromNpmDependencies(deps, prefix = '') {
        Object.entries(deps).forEach(([name, info]) => {
            const packageName = prefix ? name : name;
            if (!this.installedPackages[packageName]) {
                this.installedPackages[packageName] = info.version;
            }
            if (info.dependencies) {
                this.extractFromNpmDependencies(info.dependencies, name);
            }
        });
    }
    parseYarnLock(filePath) {
        try {
            const lockContent = (0, fs_1.readFileSync)(filePath, 'utf8');
            const lines = lockContent.split('\n');
            let currentPackage = '';
            let currentVersion = '';
            for (const line of lines) {
                const trimmed = line.trim();
                if ((trimmed.includes('@') || /^[a-zA-Z]/.test(trimmed)) &&
                    trimmed.endsWith(':')) {
                    const packageDeclaration = trimmed.replace(':', '').replace(/"/g, '');
                    currentPackage = this.extractYarnPackageName(packageDeclaration);
                }
                else if (trimmed.startsWith('version ') && currentPackage) {
                    currentVersion = trimmed.replace('version ', '').replace(/"/g, '');
                    this.installedPackages[currentPackage] = currentVersion;
                    currentPackage = '';
                }
            }
        }
        catch (error) {
            console.error('Error parsing yarn lock file:', error);
        }
    }
    parseYarnLockWithLibrary(filePath) {
        try {
            const lockContent = (0, fs_1.readFileSync)(filePath, 'utf8');
            const parsed = yarnLockfile.parse(lockContent);
            if (parsed.type === 'success') {
                Object.entries(parsed.object).forEach(([key, info]) => {
                    const packageName = this.extractYarnPackageName(key);
                    this.installedPackages[packageName] = info.version;
                });
            }
        }
        catch (error) {
            console.error('Error parsing yarn lock file with library:', error);
            this.parseYarnLock(filePath);
        }
    }
    parsePnpmLock(filePath) {
        try {
            const lockContent = (0, fs_1.readFileSync)(filePath, 'utf8');
            const lockData = yaml.load(lockContent);
            if (!lockData)
                return;
            if (lockData.dependencies) {
                Object.entries(lockData.dependencies).forEach(([name, version]) => {
                    const actualVersion = typeof version === 'string' ? version : version.specifier;
                    this.installedPackages[name] = this.cleanPnpmVersion(actualVersion);
                });
            }
            if (lockData.devDependencies) {
                Object.entries(lockData.devDependencies).forEach(([name, version]) => {
                    const actualVersion = typeof version === 'string' ? version : version.specifier;
                    this.installedPackages[name] = this.cleanPnpmVersion(actualVersion);
                });
            }
            if (lockData.packages) {
                Object.entries(lockData.packages).forEach(([path, info]) => {
                    if (path.startsWith('/')) {
                        const packageName = this.extractPnpmPackageName(path);
                        if (packageName && info.resolution) {
                            this.installedPackages[packageName] = this.cleanPnpmVersion(info.resolution.integrity
                                ? path.split('/').pop()
                                : info.version);
                        }
                    }
                });
            }
            if (lockData.importers) {
                Object.entries(lockData.importers).forEach(([importerPath, importer]) => {
                    if (importer.dependencies) {
                        Object.entries(importer.dependencies).forEach(([name, version]) => {
                            const actualVersion = typeof version === 'string' ? version : version.specifier;
                            this.installedPackages[name] =
                                this.cleanPnpmVersion(actualVersion);
                        });
                    }
                    if (importer.devDependencies) {
                        Object.entries(importer.devDependencies).forEach(([name, version]) => {
                            const actualVersion = typeof version === 'string' ? version : version.specifier;
                            this.installedPackages[name] =
                                this.cleanPnpmVersion(actualVersion);
                        });
                    }
                });
            }
        }
        catch (error) {
            console.error('Error parsing pnpm lock file:', error);
        }
    }
    extractPackageName(fullPath) {
        if (fullPath.startsWith('@')) {
            const parts = fullPath.split('/');
            return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : fullPath;
        }
        return fullPath.split('/')[0];
    }
    extractYarnPackageName(declaration) {
        const cleanDeclaration = declaration.replace(/"/g, '');
        if (cleanDeclaration.startsWith('@')) {
            const match = cleanDeclaration.match(/^(@[^/]+\/[^@]+)/);
            return match ? match[1] : cleanDeclaration.split('@')[0];
        }
        return cleanDeclaration.split('@')[0];
    }
    extractPnpmPackageName(path) {
        const parts = path.split('/').filter(Boolean);
        if (parts.length === 0)
            return '';
        if (parts[0].startsWith('@') && parts.length >= 2) {
            return `${parts[0]}/${parts[1]}`;
        }
        return parts[0];
    }
    cleanPnpmVersion(version) {
        if (!version)
            return '';
        if (version.includes('link:') || version.includes('file:')) {
            return 'local';
        }
        if (version.includes('_')) {
            return version.split('_')[0];
        }
        return version.replace(/^[\^~]/, '');
    }
    getInstalledVersion(packageName) {
        if (this.configService.get('nodeEnv') === 'contribution') {
            return '0.0.0-contribution';
        }
        return this.installedPackages[packageName] || null;
    }
    getPackageManager() {
        return this.packageManager;
    }
};
exports.LockFileService = LockFileService;
exports.LockFileService = LockFileService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], LockFileService);
