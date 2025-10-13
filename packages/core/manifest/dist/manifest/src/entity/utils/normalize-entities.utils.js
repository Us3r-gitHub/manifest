"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeEntities = normalizeEntities;
function removePrefixFromEntity(entity, prefix) {
    return entity.startsWith(prefix) ? entity.slice(prefix.length + 1) : entity;
}
function normalizeEntity(entity, manifestId) {
    if (!manifestId)
        return entity;
    return {
        ...entity,
        className: removePrefixFromEntity(entity.className, manifestId),
        slug: removePrefixFromEntity(entity.slug, manifestId),
        relationships: entity.relationships.map((relationship) => ({
            ...relationship,
            entity: removePrefixFromEntity(relationship.entity, manifestId)
        }))
    };
}
function normalizeEntities(entities, manifestId) {
    if (!manifestId)
        return entities;
    return Object.entries(entities).reduce((acc, [_, entity]) => {
        const { className, slug, relationships } = normalizeEntity(entity, manifestId);
        acc[className] = {
            ...entity,
            className,
            slug,
            relationships
        };
        return acc;
    }, {});
}
