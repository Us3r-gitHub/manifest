"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecordKeyByValue = getRecordKeyByValue;
exports.camelize = camelize;
exports.kebabize = kebabize;
exports.lowerCaseFirstLetter = lowerCaseFirstLetter;
exports.upperCaseFirstLetter = upperCaseFirstLetter;
exports.getRandomIntExcluding = getRandomIntExcluding;
exports.getDtoPropertyNameFromRelationship = getDtoPropertyNameFromRelationship;
exports.getRelationshipNameFromDtoPropertyName = getRelationshipNameFromDtoPropertyName;
exports.forceNumberArray = forceNumberArray;
exports.getSmallestImageSize = getSmallestImageSize;
exports.base64ToBlob = base64ToBlob;
function getRecordKeyByValue(record, value) {
    for (const [key, val] of Object.entries(record)) {
        if (val === value) {
            return key;
        }
    }
    return undefined;
}
function camelize(str) {
    const combined = Array.isArray(str) ? str.join('_') : str;
    return lowerCaseFirstLetter((combined || '')
        .split('_')
        .map((word, index) => index === 0 ? word : word[0].toUpperCase() + word.slice(1))
        .join(''));
}
function kebabize(str) {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/\s+/g, '-')
        .toLowerCase();
}
function lowerCaseFirstLetter(str) {
    return str.charAt(0).toLowerCase() + str.slice(1);
}
function upperCaseFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
function getRandomIntExcluding({ min, max, exclude }) {
    const randomInt = Math.floor(Math.random() * (max - min + 1)) + min;
    return exclude?.length && exclude.includes(randomInt)
        ? getRandomIntExcluding({ min, max, exclude })
        : randomInt;
}
function getDtoPropertyNameFromRelationship(relationship) {
    if (relationship.nested) {
        return relationship.name;
    }
    if (relationship?.type === 'many-to-one') {
        return relationship.name + 'Id';
    }
    else if (relationship?.type === 'many-to-many') {
        return relationship.name.endsWith('s')
            ? relationship.name.slice(0, -1) + 'Ids'
            : relationship.name + 'Id';
    }
    else {
        throw new Error('Unknown relationship');
    }
}
function getRelationshipNameFromDtoPropertyName(propertyName) {
    if (propertyName.endsWith('Id')) {
        return propertyName.endsWith('Ids')
            ? propertyName.slice(0, -3) + 's'
            : propertyName.slice(0, -2);
    }
    else {
        throw new Error('Unknown property name');
    }
}
function forceNumberArray(value) {
    if (typeof value === 'number') {
        return [value];
    }
    else if (typeof value === 'string') {
        return [parseInt(value, 10)];
    }
    else if (typeof value === 'undefined' || value === null) {
        return [];
    }
    return value.map((v) => (typeof v === 'string' ? parseInt(v, 10) : v));
}
function getSmallestImageSize(imageSizesObject) {
    return Object.keys(imageSizesObject).reduce((smallestSize, currentSize) => {
        const currentImageSize = imageSizesObject?.[currentSize];
        const smallestImageSize = imageSizesObject?.[smallestSize];
        if (currentImageSize?.width !== undefined &&
            smallestImageSize?.width !== undefined &&
            currentImageSize.width < smallestImageSize.width) {
            return currentSize;
        }
        return smallestSize;
    });
}
function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
}
