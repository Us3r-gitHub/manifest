import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { ADMIN_ENTITY_MANIFEST } from '../constants'
import { ManifestService } from '../manifest/services/manifest.service'

/**
 * Apply prefix to entity from the request.
 */
@Injectable()
export class MatchEntityMiddleware implements NestMiddleware {
  constructor(
    private readonly configService: ConfigService,
    private readonly manifestService: ManifestService
  ) {}

  use(req: Request, res: Response, next: () => void) {
    const { tenantId, entitySlug } = req.params

    if (this.configService.get('isMultiTenant'))
      this.manifestService.setManifestId(tenantId)
    if (
      this.configService.get('shouldPrefixTable') &&
      entitySlug !== ADMIN_ENTITY_MANIFEST.slug
    )
      req['entityTenant'] = `${tenantId}-${entitySlug}`

    next()
  }
}
