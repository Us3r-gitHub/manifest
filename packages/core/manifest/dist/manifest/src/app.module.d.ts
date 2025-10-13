import { LoggerService } from './logger/logger.service';
export declare class AppModule {
    private loggerService;
    constructor(loggerService: LoggerService);
    onModuleInit(): Promise<void>;
    private init;
}
