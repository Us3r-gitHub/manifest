import { ThrottlerGuard, ThrottlerRequest } from '@nestjs/throttler';
export declare class TenantBasedThrottlerGuard extends ThrottlerGuard {
    handleRequest(requestProps: ThrottlerRequest): Promise<boolean>;
}
