"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.policies = void 0;
const types_1 = require("../../../types/src");
const constants_1 = require("../constants");
const src_1 = require("../../../common/src");
exports.policies = {
    admin: ({ user, userEntityManifest }) => Promise.resolve(user && userEntityManifest.slug === constants_1.ADMIN_ENTITY_MANIFEST.slug),
    public: () => Promise.resolve(true),
    forbidden: () => Promise.resolve(false),
    restricted: async (params) => {
        if (!params.user) {
            return Promise.resolve(false);
        }
        if (await exports.policies.admin(params)) {
            return Promise.resolve(true);
        }
        if (params.options?.allow &&
            !params.options.allow.includes(params.userEntityManifest.className)) {
            return Promise.resolve(false);
        }
        if (params.options?.condition === 'self') {
            const relationshipWithUser = params.entityManifest.relationships.find((r) => r.entity === params.userEntityManifest.className);
            if (!relationshipWithUser) {
                return Promise.resolve(false);
            }
            const dtoOwnershipPropertyName = (0, src_1.getDtoPropertyNameFromRelationship)(relationshipWithUser);
            if (params.rule === 'create') {
                if (params.request.body[dtoOwnershipPropertyName] !== params.user.id) {
                    return Promise.resolve(false);
                }
            }
            if (params.rule === 'update' || params.rule === 'delete') {
                const requestedRecord = await params.entityRepository.findOneOrFail({
                    where: {
                        id: params.request.params.id
                    },
                    relations: [relationshipWithUser.name]
                });
                if (requestedRecord[relationshipWithUser.name]?.id !==
                    params.user.id) {
                    return Promise.resolve(false);
                }
                if (params.rule === 'update') {
                    if (params.request.body[dtoOwnershipPropertyName] &&
                        params.request.body[dtoOwnershipPropertyName] !==
                            requestedRecord[relationshipWithUser.name]?.id) {
                        return Promise.resolve(false);
                    }
                }
            }
            if (params.rule === 'read') {
                const relationQueryParam = params.request.query['relations'] || '';
                if (!relationQueryParam.includes(relationshipWithUser.name)) {
                    params.request.query['relations'] = relationQueryParam
                        ? relationQueryParam + ',' + relationshipWithUser.name
                        : relationshipWithUser.name;
                }
                params.request.query = {
                    ...params.request.query,
                    [relationshipWithUser.name + '.id' + types_1.WhereKeySuffix.Equal]: params.user.id
                };
            }
        }
        return Promise.resolve(true);
    }
};
