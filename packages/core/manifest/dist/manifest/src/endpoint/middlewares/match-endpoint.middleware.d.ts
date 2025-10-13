import { NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { EndpointService } from '../endpoint.service';
import { ManifestService } from '../../manifest/services/manifest.service';
export declare class MatchEndpointMiddleware implements NestMiddleware {
    private readonly endpointService;
    private readonly manifestService;
    constructor(endpointService: EndpointService, manifestService: ManifestService);
    use(req: Request, res: Response, next: () => void): void;
}
