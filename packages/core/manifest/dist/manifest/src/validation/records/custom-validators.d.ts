import { ValidationManifest } from '@repo/types';
export declare const customValidators: Record<keyof ValidationManifest, (value: unknown, context: unknown) => string | null>;
