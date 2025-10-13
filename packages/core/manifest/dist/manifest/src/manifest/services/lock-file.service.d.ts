import { ConfigService } from '@nestjs/config';
export declare class LockFileService {
    private readonly configService;
    private installedPackages;
    private packageManager;
    constructor(configService: ConfigService);
    private detectAndParseLockFile;
    private parseNpmLock;
    private extractFromNpmDependencies;
    private parseYarnLock;
    private parseYarnLockWithLibrary;
    private parsePnpmLock;
    private extractPackageName;
    private extractYarnPackageName;
    private extractPnpmPackageName;
    private cleanPnpmVersion;
    getInstalledVersion(packageName: string): string | null;
    getPackageManager(): string;
}
