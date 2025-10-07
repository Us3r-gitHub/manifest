import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { EntityManifest } from '@repo/types'
import { EntityManifestService } from '../../manifest/services/entity-manifest.service'
import { Request } from 'express'

@Injectable()
export class IsCollectionGuard implements CanActivate {
  constructor(private readonly entityManifestService: EntityManifestService) {}

  canActivate(context: ExecutionContext): boolean {
    const req: Request = context.switchToHttp().getRequest()

    const entityManifest: EntityManifest =
      this.entityManifestService.getEntityManifest({
        slug: req['entityTenant'] || context.getArgs()[0].params.entity
      })

    return !entityManifest.single
  }
}
