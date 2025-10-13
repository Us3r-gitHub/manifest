export interface AppSettings {
    rateLimits?: {
        name?: string;
        limit: number;
        ttl: number;
    }[];
}
