import { ValueTransformer } from 'typeorm';
export declare class NumberTransformer implements ValueTransformer {
    from(value: string | number): number;
    to(value: string | number): string | number;
}
