import { Module, forwardRef } from '@nestjs/common'
import { EventModule } from '../event/event.module'
import { HandlerModule } from '../handler/handler.module'
import { ManifestModule } from '../manifest/manifest.module'

@Module({
  imports: [
    EventModule,
    forwardRef(() => ManifestModule),
    forwardRef(() => HandlerModule)
  ],
  exports: [forwardRef(() => HandlerModule)]
})
export class MiddlewareModule {}
