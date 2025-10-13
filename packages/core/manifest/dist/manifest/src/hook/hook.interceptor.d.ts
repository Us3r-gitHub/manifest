import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { EntityManifestService } from '../manifest/services/entity-manifest.service';
import { HookService } from './hook.service';
import { EventService } from '../event/event.service';
export declare class HookInterceptor implements NestInterceptor {
    private readonly entityManifestService;
    private readonly hookService;
    private readonly eventService;
    constructor(entityManifestService: EntityManifestService, hookService: HookService, eventService: EventService);
    intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>>;
}
