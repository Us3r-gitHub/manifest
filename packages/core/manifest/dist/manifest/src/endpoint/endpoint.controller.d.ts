import { Request, Response } from 'express';
import { HandlerService } from '../handler/handler.service';
export declare class EndpointController {
    private readonly handlerService;
    constructor(handlerService: HandlerService);
    triggerGetEndpoint(req: Request, res: Response): Promise<unknown>;
    triggerPostEndpoint(req: Request, res: Response): Promise<unknown>;
    triggerPutEndpoint(req: Request, res: Response): Promise<unknown>;
    triggerPatchEndpoint(req: Request, res: Response): Promise<unknown>;
    triggerDeleteEndpoint(req: Request, res: Response): Promise<unknown>;
    private handleRoute;
}
