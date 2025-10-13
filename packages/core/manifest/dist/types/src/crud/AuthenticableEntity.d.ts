import { BaseEntity } from './BaseEntity';
export interface AuthenticableEntity extends BaseEntity {
    email: string;
    password: string;
    tenantId?: string;
}
