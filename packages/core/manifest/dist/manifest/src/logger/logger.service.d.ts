import { ConfigService } from '@nestjs/config';
export declare class LoggerService {
    private configService;
    constructor(configService: ConfigService);
    initMessage(): void;
}
