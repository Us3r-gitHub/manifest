"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberTransformer = void 0;
class NumberTransformer {
    from(value) {
        return Number(value);
    }
    to(value) {
        return value;
    }
}
exports.NumberTransformer = NumberTransformer;
