import { ImageSizesObject, RelationshipManifest } from '@repo/types';
export declare function getRecordKeyByValue<T extends Record<string, string>, V extends T[keyof T]>(record: T, value: V): string | undefined;
export declare function camelize(str: string | string[]): string;
export declare function kebabize(str: string): string;
export declare function lowerCaseFirstLetter(str: string): string;
export declare function upperCaseFirstLetter(str: string): string;
export declare function getRandomIntExcluding({ min, max, exclude }: {
    min: number;
    max: number;
    exclude?: number[];
}): number;
export declare function getDtoPropertyNameFromRelationship(relationship: RelationshipManifest): string;
export declare function getRelationshipNameFromDtoPropertyName(propertyName: string): string;
export declare function forceNumberArray(value: string | number | number[] | string[]): number[];
export declare function getSmallestImageSize(imageSizesObject: ImageSizesObject): string;
export declare function base64ToBlob(base64: string, contentType: string): Blob;
