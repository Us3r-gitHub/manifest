import { CanActivate } from '@nestjs/common';
import { DatabaseService } from '../../crud/services/database.service';
export declare class IsDbEmptyGuard implements CanActivate {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    canActivate(): Promise<boolean>;
}
