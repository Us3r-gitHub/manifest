import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { BackendSDK } from '../sdk/backend-sdk';
export declare class HandlerService {
    private configService;
    private readonly sdk;
    constructor(configService: ConfigService, sdk: BackendSDK);
    trigger({ path, req, res }: {
        path: string;
        req: Request;
        res: Response;
    }): Promise<unknown>;
    importHandler(handler: string, tenantId?: string): Promise<any>;
    dynamicImport(path: string): Promise<any>;
}
