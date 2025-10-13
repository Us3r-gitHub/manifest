import { AccessPolicy, AuthenticableEntity, BaseEntity, EntityManifest } from '@repo/types';
import { Rule } from './types/rule.type';
import { Request } from 'express';
import { Repository } from 'typeorm';
interface PolicyParams {
    user: AuthenticableEntity;
    entityManifest: EntityManifest;
    entityRepository?: Repository<BaseEntity>;
    userEntityManifest: EntityManifest;
    rule?: Rule;
    request?: Request;
    options?: {
        allow?: string[];
        condition?: 'self';
    };
}
export declare const policies: Record<AccessPolicy, (params: PolicyParams) => Promise<boolean>>;
export {};
