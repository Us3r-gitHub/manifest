import { BaseEntity, Paginator } from '@repo/types';
import { SelectQueryBuilder } from 'typeorm';
export declare class PaginationService {
    paginate({ query, resultsPerPage, currentPage }: {
        query?: SelectQueryBuilder<BaseEntity>;
        currentPage: number;
        resultsPerPage?: number;
    }): Promise<Paginator<BaseEntity>>;
}
