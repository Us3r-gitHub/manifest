export interface BaseEntity {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    [key: string]: unknown;
}
