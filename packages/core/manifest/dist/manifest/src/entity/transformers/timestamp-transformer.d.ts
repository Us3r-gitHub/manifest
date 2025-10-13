import { ValueTransformer } from 'typeorm';
export declare class TimestampTransformer implements ValueTransformer {
    from(value: Date | string): string;
    to(value: string): string;
}
