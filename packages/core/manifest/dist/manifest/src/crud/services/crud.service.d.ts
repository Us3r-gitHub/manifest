import { Repository } from 'typeorm';
import { BaseEntity } from '@repo/types';
import { EntityService } from '../../entity/services/entity.service';
import { EntityManifest, Paginator, SelectOption } from '@repo/types';
import { PaginationService } from './pagination.service';
import { ValidationService } from '../../validation/services/validation.service';
import { RelationshipService } from '../../entity/services/relationship.service';
import { EntityManifestService } from '../../manifest/services/entity-manifest.service';
export declare class CrudService {
    private readonly entityService;
    private readonly entityManifestService;
    private readonly paginationService;
    private readonly validationService;
    private readonly relationshipService;
    constructor(entityService: EntityService, entityManifestService: EntityManifestService, paginationService: PaginationService, validationService: ValidationService, relationshipService: RelationshipService);
    private filterValidProperties;
    findAll({ entitySlug, queryParams, fullVersion }: {
        entitySlug: string;
        queryParams?: {
            [key: string]: string | string[];
        };
        fullVersion?: boolean;
    }): Promise<Paginator<BaseEntity>>;
    findSelectOptions({ entitySlug, queryParams }: {
        entitySlug: string;
        queryParams?: {
            [key: string]: string | string[];
        };
    }): Promise<SelectOption[]>;
    findOne({ entitySlug, id, queryParams, fullVersion }: {
        entitySlug: string;
        id?: string;
        queryParams?: {
            [key: string]: string | string[];
        };
        fullVersion?: boolean;
    }): Promise<BaseEntity>;
    store(entitySlug: string, itemDto: Partial<BaseEntity>): Promise<BaseEntity>;
    storeEmpty(entitySlug: string): Promise<BaseEntity>;
    update({ entitySlug, id, itemDto, partialReplacement }: {
        entitySlug: string;
        id?: string;
        itemDto: Partial<BaseEntity>;
        partialReplacement?: boolean;
    }): Promise<BaseEntity>;
    delete(entitySlug: string, id: string): Promise<BaseEntity>;
    createWithDefaults({ repository, entityManifest, itemDto }: {
        repository: Repository<BaseEntity>;
        entityManifest: EntityManifest;
        itemDto: Partial<BaseEntity>;
    }): BaseEntity;
    private getVisibleProps;
    private loadRelations;
    private filterQuery;
}
