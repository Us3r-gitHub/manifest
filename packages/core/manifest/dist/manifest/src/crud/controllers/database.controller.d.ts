import { DatabaseService } from '../services/database.service';
export declare class DatabaseController {
    private readonly databaseService;
    constructor(databaseService: DatabaseService);
    isDbEmpty(): Promise<{
        empty: boolean;
    }>;
}
