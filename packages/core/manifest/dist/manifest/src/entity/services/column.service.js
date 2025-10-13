"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnService = void 0;
const common_1 = require("@nestjs/common");
const sqlite_prop_type_column_types_1 = require("../columns/sqlite-prop-type-column-types");
const postgres_prop_type_column_types_copy_1 = require("../columns/postgres-prop-type-column-types copy");
const mysql_prop_type_column_types_1 = require("../columns/mysql-prop-type-column-types");
let ColumnService = class ColumnService {
    static getColumnTypes(dbConnection) {
        let columns;
        switch (dbConnection) {
            case 'sqlite':
                columns = sqlite_prop_type_column_types_1.sqlitePropTypeColumnTypes;
                break;
            case 'postgres':
                columns = postgres_prop_type_column_types_copy_1.postgresPropTypeColumnTypes;
                break;
            case 'mysql':
                columns = mysql_prop_type_column_types_1.mysqlPropTypeColumnTypes;
                break;
        }
        return columns;
    }
    static getColumnType(dbConnection, propType) {
        return this.getColumnTypes(dbConnection)[propType];
    }
};
exports.ColumnService = ColumnService;
exports.ColumnService = ColumnService = __decorate([
    (0, common_1.Injectable)()
], ColumnService);
