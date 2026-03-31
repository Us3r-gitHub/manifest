import { AppManifest, EntityManifest } from '@repo/types'

/**
 * Removes the given prefix (e.g. tenantId) from the start of an entity string.
 *
 * @param entity - The entity name or slug.
 * @param prefix - The prefix to remove.
 * @returns The entity without the prefix, if it was present.
 */
function removePrefixFromEntity(entity: string, prefix?: string): string {
  return entity.startsWith(prefix) ? entity.slice(prefix.length + 1) : entity
}

function normalizeEntity(entity: EntityManifest, manifestId?: string) {
  if (!manifestId) return entity

  return {
    ...entity,
    className: removePrefixFromEntity(entity.className, manifestId),
    slug: removePrefixFromEntity(entity.slug, manifestId),
    relationships: entity.relationships.map((relationship) => ({
      ...relationship,
      entity: removePrefixFromEntity(relationship.entity, manifestId)
    }))
  }
}

export function normalizeEntities(
  entities: AppManifest['entities'],
  manifestId?: string
) {
  if (!manifestId) return entities

  return Object.entries(entities).reduce(
    (
      acc: { [k: string]: EntityManifest },
      [_, entity]: [string, EntityManifest]
    ) => {
      const { className, slug, relationships } = normalizeEntity(
        entity,
        manifestId
      )

      acc[className] = {
        ...entity,
        className,
        slug,
        relationships
      }

      return acc
    },
    {}
  )
}
