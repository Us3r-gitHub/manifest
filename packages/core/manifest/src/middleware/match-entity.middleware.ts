import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { ADMIN_ENTITY_MANIFEST } from 'src/constants'

/**
 * Apply prefix to entity from the request.
 */
@Injectable()
export class MatchEntityMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  use(req: Request, res: Response, next: () => void) {
    const { tenantId, entity } = req.params

    if (
      this.configService.get('shouldPrefixTable') &&
      entity !== ADMIN_ENTITY_MANIFEST.slug
    )
      req['entityTenant'] = `${tenantId}-${entity}`

    next()
  }
}
