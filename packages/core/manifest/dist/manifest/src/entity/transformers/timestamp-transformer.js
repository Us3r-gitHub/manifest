"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimestampTransformer = void 0;
class TimestampTransformer {
    from(value) {
        return value instanceof Date ? value.toISOString() : value;
    }
    to(value) {
        return value;
    }
}
exports.TimestampTransformer = TimestampTransformer;
