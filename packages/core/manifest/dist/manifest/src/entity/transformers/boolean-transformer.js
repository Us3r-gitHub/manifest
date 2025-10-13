"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanTransformer = void 0;
class BooleanTransformer {
    constructor(connection) {
        this.connection = connection;
    }
    to(value) {
        if (this.connection === 'mysql') {
            return value ? 1 : 0;
        }
        return value;
    }
    from(value) {
        if (this.connection === 'mysql') {
            return value === 1;
        }
        return value;
    }
}
exports.BooleanTransformer = BooleanTransformer;
