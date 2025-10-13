"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityLoaderService = void 0;
const types_1 = require("../../../../types/src");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const sqlite_prop_type_column_types_1 = require("../columns/sqlite-prop-type-column-types");
const relationship_service_1 = require("./relationship.service");
const mysql_prop_type_column_types_1 = require("../columns/mysql-prop-type-column-types");
const postgres_prop_type_column_types_copy_1 = require("../columns/postgres-prop-type-column-types copy");
const column_service_1 = require("./column.service");
const boolean_transformer_1 = require("../transformers/boolean-transformer");
const number_transformer_1 = require("../transformers/number-transformer");
const timestamp_transformer_1 = require("../transformers/timestamp-transformer");
const manifest_service_1 = require("../../manifest/services/manifest.service");
const constants_1 = require("../../constants");
let EntityLoaderService = class EntityLoaderService {
    constructor(configService, manifestService, relationshipService) {
        this.configService = configService;
        this.manifestService = manifestService;
        this.relationshipService = relationshipService;
    }
    loadEntities(dbConnection) {
        const appManifest = this.manifestService.getAppManifest({
            fullVersion: true
        });
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
        const entitySchemas = Object.values(appManifest.entities).map((entityManifest) => {
            const entitySchema = new typeorm_1.EntitySchema({
                name: entityManifest.className,
                columns: entityManifest.properties.reduce((acc, propManifest) => {
                    let transformer = undefined;
                    if (propManifest.type === types_1.PropType.Number ||
                        propManifest.type === types_1.PropType.Money) {
                        transformer = new number_transformer_1.NumberTransformer();
                    }
                    if (propManifest.type === types_1.PropType.Timestamp) {
                        transformer = new timestamp_transformer_1.TimestampTransformer();
                    }
                    if (propManifest.type === types_1.PropType.Boolean) {
                        transformer = new boolean_transformer_1.BooleanTransformer(dbConnection);
                    }
                    acc[propManifest.name] = {
                        name: propManifest.name,
                        type: columns[propManifest.type],
                        transformer,
                        nullable: true
                    };
                    return acc;
                }, entityManifest['authenticable']
                    ? { ...this.getBaseAuthenticableEntityColumns(dbConnection) }
                    : { ...this.getBaseEntityColumns(dbConnection) }),
                relations: this.relationshipService.getEntitySchemaRelationOptions(entityManifest),
                uniques: entityManifest['authenticable']
                    ? entityManifest.className === constants_1.ADMIN_ENTITY_MANIFEST.className
                        ? [
                            {
                                columns: this.configService.get('shouldPrefixTable')
                                    ? ['email', 'tenantId']
                                    : ['email']
                            }
                        ]
                        : [{ columns: ['email'] }]
                    : []
            });
            return entitySchema;
        });
        return entitySchemas;
    }
    getBaseEntityColumns(dbConnection) {
        let idType;
        switch (dbConnection) {
            case 'sqlite':
                idType = 'text';
                break;
            case 'postgres':
                idType = 'uuid';
                break;
            case 'mysql':
                idType = 'varchar';
                break;
        }
        return {
            id: {
                type: idType,
                primary: true,
                generated: 'uuid'
            },
            createdAt: {
                name: 'createdAt',
                type: column_service_1.ColumnService.getColumnType(dbConnection, types_1.PropType.Timestamp),
                createDate: true,
                select: false
            },
            updatedAt: {
                name: 'updatedAt',
                type: column_service_1.ColumnService.getColumnType(dbConnection, types_1.PropType.Timestamp),
                updateDate: true,
                select: false
            }
        };
    }
    getBaseAuthenticableEntityColumns(dbConnection) {
        return Object.assign(this.getBaseEntityColumns(dbConnection), {
            email: {
                name: 'email',
                type: column_service_1.ColumnService.getColumnType(dbConnection, types_1.PropType.Email),
                unique: true
            },
            password: {
                name: 'password',
                type: column_service_1.ColumnService.getColumnType(dbConnection, types_1.PropType.Password),
                select: false
            }
        });
    }
};
exports.EntityLoaderService = EntityLoaderService;
exports.EntityLoaderService = EntityLoaderService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        manifest_service_1.ManifestService,
        relationship_service_1.RelationshipService])
], EntityLoaderService);
