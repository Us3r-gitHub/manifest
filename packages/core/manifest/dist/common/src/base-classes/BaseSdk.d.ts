export declare class BaseSDK {
    slug: string;
    isSingleEntity: boolean;
    queryParams: {
        [key: string]: string;
    };
    from(slug: string): this;
    where(whereClause: string): this;
    andWhere(whereClause: string): this;
    orderBy(propName: string, order?: {
        desc: boolean;
    }): this;
    with(relations: string[]): this;
}
