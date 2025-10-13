import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ManifestService } from '../manifest/services/manifest.service';
export declare class MatchEntityMiddleware implements NestMiddleware {
    private readonly configService;
    private readonly manifestService;
    constructor(configService: ConfigService, manifestService: ManifestService);
    use(req: Request, res: Response, next: () => void): void;
}
