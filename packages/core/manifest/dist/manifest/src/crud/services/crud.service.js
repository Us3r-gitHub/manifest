"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const common_1 = require("@nestjs/common");
const common_2 = require("../../../../common/src");
const entity_service_1 = require("../../entity/services/entity.service");
const types_1 = require("../../../../types/src");
const constants_1 = require("../../constants");
const pagination_service_1 = require("./pagination.service");
const validation_service_1 = require("../../validation/services/validation.service");
const relationship_service_1 = require("../../entity/services/relationship.service");
const entity_manifest_service_1 = require("../../manifest/services/entity-manifest.service");
const prop_type_valid_where_operators_1 = require("../records/prop-type-valid-where-operators");
let CrudService = class CrudService {
    constructor(entityService, entityManifestService, paginationService, validationService, relationshipService) {
        this.entityService = entityService;
        this.entityManifestService = entityManifestService;
        this.paginationService = paginationService;
        this.validationService = validationService;
        this.relationshipService = relationshipService;
    }
    filterValidProperties(itemDto, entityRepository) {
        const entityMetadata = entityRepository.metadata;
        const allColumns = entityMetadata.columns.map((col) => col.propertyName);
        const validRelationships = entityMetadata.relations.map((rel) => rel.propertyName);
        const validNestedRelationships = entityMetadata.relations
            .filter((relation) => (relation.relationType === 'one-to-many' ||
            relation.relationType === 'one-to-one') &&
            this.entityManifestService.getEntityManifest({
                className: relation.type,
                includeNested: true
            }).nested)
            .map((r) => r.propertyName);
        const validProperties = allColumns.filter((col) => !validRelationships.includes(col));
        return Object.fromEntries(Object.entries(itemDto).filter(([key]) => {
            if (validProperties.includes(key)) {
                return true;
            }
            if (key.endsWith('Id') &&
                validRelationships.includes(key.slice(0, -2))) {
                return true;
            }
            if (validNestedRelationships.includes(key)) {
                return true;
            }
            return false;
        }));
    }
    async findAll({ entitySlug, queryParams, fullVersion }) {
        const entityManifest = this.entityManifestService.getEntityManifest({
            slug: entitySlug,
            fullVersion
        });
        const entityMetadata = this.entityService.getEntityMetadata({
            className: entityManifest.className
        });
        const entityRepository = this.entityService.getEntityRepository({ entityMetadata });
        const query = entityRepository.createQueryBuilder('entity');
        query.select(this.getVisibleProps({
            props: entityManifest.properties,
            fullVersion
        }));
        this.loadRelations({
            query,
            entityMetadata,
            relationships: entityManifest.relationships,
            requestedRelations: queryParams?.relations?.toString().split(',')
        });
        this.filterQuery({
            query,
            queryParams,
            entityManifest
        });
        if (queryParams?.orderBy) {
            if (queryParams.orderBy !== 'id' &&
                !entityManifest.properties.find((prop) => prop.name === queryParams.orderBy && !prop.hidden)) {
                throw new common_1.HttpException(`Property ${queryParams.orderBy} does not exist in ${entitySlug} and thus cannot be used for ordering`, common_1.HttpStatus.BAD_REQUEST);
            }
            query.orderBy(`entity.${queryParams.orderBy}`, queryParams.order === 'DESC' ? 'DESC' : 'ASC');
        }
        else {
            query.addSelect('entity.createdAt').orderBy('entity.createdAt', 'DESC');
        }
        return this.paginationService.paginate({
            query,
            currentPage: parseInt(queryParams?.page, 10) || 1,
            resultsPerPage: parseInt(queryParams?.perPage, 10) || constants_1.DEFAULT_RESULTS_PER_PAGE
        });
    }
    async findSelectOptions({ entitySlug, queryParams }) {
        const items = await this.findAll({
            entitySlug,
            queryParams: Object.assign({}, queryParams, { perPage: -1 })
        });
        const entityManifest = this.entityManifestService.getEntityManifest({
            slug: entitySlug
        });
        return items.data.map((item) => ({
            id: item.id,
            label: item[entityManifest.mainProp]
        }));
    }
    async findOne({ entitySlug, id, queryParams, fullVersion }) {
        const entityManifest = this.entityManifestService.getEntityManifest({
            slug: entitySlug,
            fullVersion
        });
        if (!entityManifest.single && !id) {
            throw new Error('Id is required for collections.');
        }
        const entityMetadata = this.entityService.getEntityMetadata({
            className: entityManifest.className
        });
        const query = this.entityService
            .getEntityRepository({ entityMetadata })
            .createQueryBuilder('entity')
            .select(this.getVisibleProps({
            props: entityManifest.properties,
            fullVersion
        }));
        if (id) {
            query.where('entity.id = :id', { id });
        }
        this.loadRelations({
            query,
            entityMetadata,
            relationships: entityManifest.relationships,
            requestedRelations: queryParams?.relations?.toString().split(',')
        });
        this.filterQuery({
            query,
            queryParams,
            entityManifest
        });
        const item = await query.getOne();
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        return item;
    }
    async store(entitySlug, itemDto) {
        const repository = this.entityService.getEntityRepository({ entitySlug });
        const entityManifest = this.entityManifestService.getEntityManifest({
            slug: entitySlug,
            fullVersion: true
        });
        const relationItems = await this.relationshipService.fetchRelationItemsFromDto({
            itemDto,
            relationships: entityManifest.relationships.filter((r) => r.type === 'many-to-one' ||
                (r.type === 'many-to-many' && r.owningSide))
        });
        const newItem = this.createWithDefaults({
            repository,
            entityManifest,
            itemDto: this.filterValidProperties(itemDto, repository)
        });
        entityManifest.properties
            .filter((prop) => prop.type === types_1.PropType.Password)
            .forEach((prop) => {
            if (newItem[prop.name]) {
                newItem[prop.name] = bcryptjs_1.default.hashSync(itemDto['password'], constants_1.SALT_ROUNDS);
            }
        });
        const errors = this.validationService.validate(newItem, entityManifest);
        if (errors.length) {
            throw new common_1.HttpException(errors, common_1.HttpStatus.BAD_REQUEST);
        }
        return repository.save({ ...newItem, ...relationItems });
    }
    async storeEmpty(entitySlug) {
        const entityRepository = this.entityService.getEntityRepository({ entitySlug });
        return entityRepository.save({});
    }
    async update({ entitySlug, id, itemDto, partialReplacement }) {
        const entityManifest = this.entityManifestService.getEntityManifest({
            slug: entitySlug,
            fullVersion: true
        });
        if (!entityManifest.single && !id) {
            throw new Error('Id is required for collections.');
        }
        const entityRepository = this.entityService.getEntityRepository({ entitySlug });
        const findParams = id ? { where: { id } } : { where: {} };
        const item = await entityRepository.findOne(findParams);
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        if (entityManifest.authenticable) {
            delete item['password'];
        }
        const relationItems = await this.relationshipService.fetchRelationItemsFromDto({
            itemDto,
            relationships: entityManifest.relationships.filter((r) => r.type === 'many-to-one' ||
                (r.type === 'many-to-many' && r.owningSide)),
            emptyMissing: !partialReplacement
        });
        let filteredItemDto = this.filterValidProperties(itemDto, entityRepository);
        if (partialReplacement) {
            filteredItemDto = { ...item, ...filteredItemDto };
            Object.keys(relationItems).forEach((key) => {
                if (relationItems[key] === undefined ||
                    relationItems[key]?.length === 0) {
                    delete relationItems[key];
                }
            });
        }
        const updatedItem = entityRepository.create({
            id: item.id,
            ...filteredItemDto
        });
        if (entityManifest.authenticable &&
            filteredItemDto.password?.length) {
            updatedItem.password = bcryptjs_1.default.hashSync(filteredItemDto['password'], constants_1.SALT_ROUNDS);
        }
        else {
            delete updatedItem.password;
        }
        const errors = this.validationService.validate(updatedItem, entityManifest, {
            isUpdate: true
        });
        if (errors.length) {
            throw new common_1.HttpException(errors, common_1.HttpStatus.BAD_REQUEST);
        }
        return entityRepository.save({ ...updatedItem, ...relationItems });
    }
    async delete(entitySlug, id) {
        const entityRepository = this.entityService.getEntityRepository({
            entitySlug
        });
        const oneToManyRelationships = this.entityManifestService
            .getEntityManifest({
            slug: entitySlug
        })
            .relationships.filter((r) => r.type === 'one-to-many' && !r.nested);
        const item = await entityRepository.findOne({
            where: { id },
            relations: oneToManyRelationships.map((r) => r.name)
        });
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        if (oneToManyRelationships.length) {
            oneToManyRelationships.forEach((relationship) => {
                const relatedItems = item[relationship.name];
                if (relatedItems.length) {
                    throw new common_1.HttpException(`Cannot delete item as it has related ${relationship.name}. Please delete the related items first.`, common_1.HttpStatus.BAD_REQUEST);
                }
            });
        }
        await entityRepository.remove(item);
        return item;
    }
    createWithDefaults({ repository, entityManifest, itemDto }) {
        const newItem = repository.create(itemDto);
        entityManifest.properties.forEach((prop) => {
            if (prop.default && typeof newItem[prop.name] === 'undefined') {
                newItem[prop.name] = prop.default;
            }
        });
        return newItem;
    }
    getVisibleProps({ props, alias = 'entity', fullVersion }) {
        const visibleProps = [`${alias}.id`];
        props
            .filter((prop) => prop.name !== 'password')
            .filter((prop) => fullVersion || !prop.hidden)
            .forEach((prop) => visibleProps.push(`${alias}.${prop.name}`));
        return visibleProps;
    }
    loadRelations({ query, entityMetadata, relationships, requestedRelations, alias = 'entity' }) {
        entityMetadata.relations.forEach((relationMetadata) => {
            const relationshipManifest = relationships.find((relationship) => relationship.name === relationMetadata.propertyName);
            if (!relationshipManifest.eager &&
                !requestedRelations?.includes(relationMetadata.propertyName)) {
                return;
            }
            const aliasName = (0, common_2.camelize)([alias, relationMetadata.propertyName]);
            query.leftJoin(`${alias}.${relationMetadata.propertyName}`, aliasName);
            const relationEntityManifest = this.entityManifestService.getEntityManifest({
                className: relationMetadata.inverseEntityMetadata.targetName,
                includeNested: true
            });
            query.addSelect(this.getVisibleProps({
                props: relationEntityManifest.properties,
                alias: aliasName
            }));
            const relationEntityMetadata = this.entityService.getEntityMetadata({
                className: relationMetadata.inverseEntityMetadata.targetName
            });
            if (relationEntityMetadata.relations.length) {
                query = this.loadRelations({
                    query,
                    entityMetadata: relationEntityMetadata,
                    relationships: relationEntityManifest.relationships,
                    requestedRelations: requestedRelations
                        ?.filter((requestedRelation) => requestedRelation !== relationMetadata.propertyName)
                        .map((requestedRelation) => requestedRelation.replace(`${relationMetadata.propertyName}.`, '')),
                    alias: aliasName
                });
            }
        });
        return query;
    }
    filterQuery({ query, queryParams, entityManifest }) {
        Object.entries(queryParams || {})
            .filter(([_key, value]) => value)
            .filter(([key]) => !constants_1.QUERY_PARAMS_RESERVED_WORDS.includes(key))
            .forEach(([key, value], index) => {
            const suffix = Object.values(types_1.WhereKeySuffix)
                .reverse()
                .find((suffix) => key.includes(suffix));
            if (!suffix) {
                throw new common_1.HttpException('Query param key should include an operator suffix like _eq, _gt, _lt, _in, etc.', common_1.HttpStatus.BAD_REQUEST);
            }
            const operator = (0, common_2.getRecordKeyByValue)(types_1.whereOperatorKeySuffix, suffix);
            const propName = key.replace(suffix, '');
            const prop = entityManifest.properties.find((prop) => prop.name === propName && !prop.hidden);
            if (prop && !(0, prop_type_valid_where_operators_1.isValidWhereOperator)(prop.type, operator)) {
                throw new common_1.HttpException(`Operator ${operator} (with '${suffix}' suffix) is not valid for property ${propName}. ${prop.type} properties can only use the following operators: ${(0, prop_type_valid_where_operators_1.getValidWhereOperators)(prop.type)
                    .map((operator) => `'${operator}'`)
                    .join(', ')}.`, common_1.HttpStatus.BAD_REQUEST);
            }
            const relation = entityManifest.relationships.find((relationship) => relationship.name === propName.split('.')[0]);
            if (!prop && !relation) {
                throw new common_1.HttpException(`Property ${propName} does not exist in ${entityManifest.className}`, common_1.HttpStatus.BAD_REQUEST);
            }
            let whereKey;
            if (relation) {
                const aliasName = (0, common_2.camelize)(['entity', relation.name]);
                whereKey = `${aliasName}.${propName.split('.')[1]}`;
            }
            else {
                whereKey = `entity.${propName}`;
            }
            if (prop && prop.type === types_1.PropType.Boolean) {
                if (value === 'true') {
                    value = '1';
                }
                else if (value === 'false') {
                    value = '0';
                }
            }
            if (operator === types_1.WhereOperator.In) {
                const inValues = value.split(',');
                query.andWhere(`${whereKey} ${operator} (:...value_${index})`, {
                    [`value_${index}`]: inValues
                });
            }
            else {
                query.andWhere(`${whereKey} ${operator} :value_${index}`, {
                    [`value_${index}`]: value
                });
            }
        });
        return query;
    }
};
exports.CrudService = CrudService;
exports.CrudService = CrudService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [entity_service_1.EntityService,
        entity_manifest_service_1.EntityManifestService,
        pagination_service_1.PaginationService,
        validation_service_1.ValidationService,
        relationship_service_1.RelationshipService])
], CrudService);
