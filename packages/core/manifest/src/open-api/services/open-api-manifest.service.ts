import { EntityManifest } from '@repo/types'
import { Injectable } from '@nestjs/common'
import { PathItemObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { getForbiddenResponse } from '../utils/common-response.utils'
import { ConfigService } from '@nestjs/config'
import { OpenApiUtilsService } from './open-api-utils.service'

@Injectable()
export class OpenApiManifestService {
    constructor(
      private readonly configService: ConfigService,
      private readonly openApiUtilsService: OpenApiUtilsService
    ) {}

  /**
   * Generates the paths for the manifest endpoints.
   *
   * @param entityManifests The entity manifests.
   * @param tenantId The tenantId.
   * @returns The paths for the manifest endpoints.
   *
   */
  generateManifestPaths(
    entityManifests: EntityManifest[],
    tenantId?: string
  ): Record<string, PathItemObject> {
    const paths: Record<string, PathItemObject> = {
      ['/manifest']: {
        get: {
          summary: 'Get the manifest',
          description: 'Retrieves the manifest of the application.',
          tags: ['Manifest'],
          security: [
            {
              Admin: []
            }
          ],
          responses: {
            '200': {
              description: 'The manifest of the application.',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/AppManifest'
                  }
                }
              }
            },
            '403': getForbiddenResponse()
          }
        }
      }
    }

    entityManifests.forEach(
      (entityManifest: EntityManifest) => {
        const slug = this.configService.get('shouldPrefixTable')
          ? this.openApiUtilsService.removePrefixFromSlug(entityManifest.slug, tenantId)
          : entityManifest.slug

        paths[`/manifest/entities/${slug}`] =
          this.generateEntityManifestPath(entityManifest)
      }
    )

    return paths
  }

  /**
   * Generates the path for the entity manifest endpoint.
   *
   * @param entityManifest The manifest of the entity.
   * @returns The path for the entity manifest endpoint.
   *
   */
  generateEntityManifestPath(entityManifest: EntityManifest): PathItemObject {
    return {
      get: {
        summary: `Get the ${entityManifest.nameSingular} manifest`,
        description: `Retrieves the manifest of the ${entityManifest.nameSingular} entity with all its properties.`,
        tags: ['Manifest'],
        security: [
          {
            Admin: []
          }
        ],
        responses: {
          '200': {
            description: `The manifest of the ${entityManifest.nameSingular} entity.`,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/EntityManifest'
                }
              }
            }
          },
          '403': getForbiddenResponse()
        }
      }
    }
  }
}
