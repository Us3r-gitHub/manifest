import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EventService } from '../event/event.service';
import { EntityManifestService } from '../manifest/services/entity-manifest.service';
import { HandlerService } from '../handler/handler.service';
export declare class MiddlewareInterceptor implements NestInterceptor {
    private readonly eventService;
    private readonly entityManifestService;
    private readonly handlerService;
    constructor(eventService: EventService, entityManifestService: EntityManifestService, handlerService: HandlerService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>>;
}
