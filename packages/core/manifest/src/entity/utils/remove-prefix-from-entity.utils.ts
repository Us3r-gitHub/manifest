/**
 * Removes the given prefix (e.g. tenantId) from the start of an entity string.
 *
 * @param entity - The entity name or slug.
 * @param prefix - The prefix to remove.
 * @returns The entity without the prefix, if it was present.
 */
export function removePrefixFromEntity(
  entity: string,
  prefix?: string
): string {
  return entity.startsWith(prefix) ? entity.slice(prefix.length + 1) : entity
}
