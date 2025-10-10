import { AppManifest, EntityManifest } from '@repo/types'
import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common'
import { Request } from 'express'
import { AuthService } from '../../auth/auth.service'
import { ManifestService } from '../services/manifest.service'
import { IsAdminGuard } from '../../auth/guards/is-admin.guard'
import { EntityManifestService } from '../services/entity-manifest.service'
import { removePrefixFromEntity } from '../../entity/utils/remove-prefix-from-entity.utils'

@Controller('/:tenantId/manifest')
export class ManifestController {
  constructor(
    private manifestService: ManifestService,
    private entityManifestService: EntityManifestService,
    private authService: AuthService
  ) {}

  /**
   * Get the app name. This endpoint is public.
   *
   * @returns The app name.
   */
  @Get('app-name')
  async getAppName(): Promise<{ name: string }> {
    const manifest = this.manifestService.getAppManifest()
    return { name: manifest.name }
  }

  /**
   * Get the app manifest. This is the main descriptive file of the data structure of the app.
   *
   * @returns The app manifest.
   */
  @Get()
  @UseGuards(IsAdminGuard)
  async getAppManifest(): Promise<AppManifest> {
    const appManifest = this.manifestService.getAppManifest({
      fullVersion: true
    })
    const manifestId = this.manifestService.getManifestId()

    const entities = Object.entries(appManifest.entities).reduce(
      (
        acc: { [k: string]: EntityManifest },
        [className, entity]: [string, EntityManifest]
      ) => {
        const name = removePrefixFromEntity(className, manifestId)

        acc[name] = {
          ...entity,
          className: name,
          slug: removePrefixFromEntity(entity.slug, manifestId),
          relationships: entity.relationships.map((relationship) => ({
            ...relationship,
            entity: removePrefixFromEntity(relationship.entity, manifestId)
          }))
        }

        return acc
      },
      {}
    )

    return { ...appManifest, entities }
  }

  /**
   * Get the entity manifest for a specific entity. This is the main descriptive file of the data structure of the entity.
   *
   * @param entitySlug The slug of the entity.
   *
   * @returns The entity manifest.
   */
  @Get('entities/:entitySlug')
  @UseGuards(IsAdminGuard)
  async getEntityManifest(
    @Param('entitySlug') entitySlug: string,
    @Req() req: Request
  ): Promise<EntityManifest> {
    const isAdmin: boolean = await this.authService.isReqUserAdmin(req)

    return this.entityManifestService.getEntityManifest({
      slug: req['entityTenant'] || entitySlug,
      fullVersion: isAdmin
    })
  }
}
