"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeederService = void 0;
const types_1 = require("../../../../types/src");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const faker_1 = require("@faker-js/faker");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const constants_1 = require("../../constants");
const storage_service_1 = require("../../storage/services/storage.service");
const entity_service_1 = require("../../entity/services/entity.service");
const manifest_service_1 = require("../../manifest/services/manifest.service");
const entity_manifest_service_1 = require("../../manifest/services/entity-manifest.service");
let SeederService = class SeederService {
    constructor(configService, entityService, manifestService, entityManifestService, storageService, dataSource) {
        this.configService = configService;
        this.entityService = entityService;
        this.manifestService = manifestService;
        this.entityManifestService = entityManifestService;
        this.storageService = storageService;
        this.dataSource = dataSource;
        this.seededFiles = {};
        this.seededImages = {};
        this.records = {};
    }
    async seed(tableName) {
        let entityMetadatas = this.entityService.getEntityMetadatas();
        if (tableName) {
            entityMetadatas = entityMetadatas.filter((entity) => entity.tableName === tableName);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        const dbConnection = this.dataSource.options
            .type;
        switch (dbConnection) {
            case 'postgres':
                await Promise.all(entityMetadatas.map(async (entity) => queryRunner.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE`)));
                await Promise.all(entityMetadatas.map(async (entity) => queryRunner
                    .query(`ALTER SEQUENCE "${entity.tableName}_id_seq" RESTART WITH 1`)
                    .catch(() => { })));
                break;
            case 'mysql':
                await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');
                await Promise.all(entityMetadatas.map(async (entity) => queryRunner.query(`TRUNCATE TABLE \`${entity.tableName}\``)));
                break;
            case 'sqlite':
                await queryRunner.query('PRAGMA foreign_keys = OFF');
                await Promise.all(entityMetadatas.map(async (entity) => queryRunner.query(`DELETE FROM [${entity.tableName}]`)));
                await queryRunner.query('PRAGMA foreign_keys = ON');
                break;
        }
        entityMetadatas = entityMetadatas.filter((entity) => entity.tableType === 'regular');
        if (this.configService.get('shouldPrefixTable')) {
            const manifestFiles = this.configService.get('manifestFiles');
            for (const manifestFile of manifestFiles) {
                const manifestId = path.basename(path.dirname(manifestFile));
                this.manifestService.setManifestId(manifestId);
                const currentEntityMetadatas = entityMetadatas.filter((entity) => entity.tableName.startsWith(manifestId));
                await this.seedEntities(currentEntityMetadatas);
            }
        }
        else {
            await this.seedEntities(entityMetadatas);
        }
        const repository = this.entityService.getEntityRepository({
            entitySlug: constants_1.ADMIN_ENTITY_MANIFEST.slug
        });
        if (this.configService.get('isMultiTenant')) {
            const manifestFiles = this.configService.get('manifestFiles');
            for (const manifestFile of manifestFiles) {
                const manifestId = path.basename(path.dirname(manifestFile));
                console.log(`✅ Seeding Admin for ${manifestId}`);
                await this.seedAdmin(repository, manifestId);
            }
        }
        else {
            await this.seedAdmin(repository);
        }
    }
    async seedEntities(entityMetadatas) {
        for (const entityMetadata of entityMetadatas) {
            const repository = this.entityService.getEntityRepository({
                entityMetadata
            });
            if (entityMetadata.name === constants_1.ADMIN_ENTITY_MANIFEST.className) {
                continue;
            }
            const entityManifest = this.entityManifestService.getEntityManifest({
                className: entityMetadata.name,
                fullVersion: true,
                includeNested: true
            });
            if (!entityManifest.nested) {
                console.log(`✅ Seeding ${entityManifest.seedCount} ${entityManifest.seedCount > 1 ? entityManifest.namePlural : entityManifest.nameSingular}...`);
            }
            for (let i = 0; i < entityManifest.seedCount; i++) {
                const newRecord = repository.create();
                if (entityManifest.authenticable) {
                    entityManifest.properties.push(...constants_1.AUTHENTICABLE_PROPS);
                }
                for (const propertyManifest of entityManifest.properties) {
                    newRecord[propertyManifest.name] = await this.seedProperty(propertyManifest, entityManifest);
                }
                let manyToOneRelationships = entityManifest.relationships.filter((relationship) => relationship.type === 'many-to-one');
                let oneToOneRelationships = entityManifest.relationships.filter((relationship) => relationship.type === 'one-to-one' && relationship.owningSide);
                if (entityManifest.nested) {
                    if (manyToOneRelationships.length > 1) {
                        manyToOneRelationships = [
                            manyToOneRelationships[faker_1.faker.number.int({
                                min: 0,
                                max: manyToOneRelationships.length - 1
                            })]
                        ];
                    }
                    if (oneToOneRelationships.length > 1) {
                        oneToOneRelationships = [
                            oneToOneRelationships[faker_1.faker.number.int({
                                min: 0,
                                max: oneToOneRelationships.length - 1
                            })]
                        ];
                    }
                }
                for (const relationship of manyToOneRelationships) {
                    newRecord[relationship.name] =
                        await this.seedRelationships(relationship);
                }
                for (const relationship of oneToOneRelationships) {
                    newRecord[relationship.name] =
                        await this.seedRelationships(relationship);
                }
                await repository.save(newRecord);
            }
        }
        const manyToManyPromises = [];
        for (const entityMetadata of entityMetadatas) {
            const entityManifest = this.entityManifestService.getEntityManifest({
                className: entityMetadata.name,
                fullVersion: true,
                includeNested: true
            });
            const repository = this.entityService.getEntityRepository({
                entityMetadata
            });
            const allRecords = await repository.find();
            const manyToManyRelationships = entityManifest.relationships.filter((relationship) => relationship.type === 'many-to-many' && relationship.owningSide);
            for (const relationshipManifest of manyToManyRelationships) {
                for (const record of allRecords) {
                    record[relationshipManifest.name] =
                        await this.seedRelationships(relationshipManifest);
                    manyToManyPromises.push(repository.save(record));
                }
            }
        }
        await Promise.all(manyToManyPromises);
    }
    async seedProperty(propertyManifest, entityManifest) {
        const typeHandlers = {
            [types_1.PropType.String]: () => Promise.resolve(faker_1.faker.commerce.product()),
            [types_1.PropType.Number]: () => Promise.resolve(faker_1.faker.number.int({ max: 50 })),
            [types_1.PropType.Link]: () => Promise.resolve('https://manifest.build'),
            [types_1.PropType.Text]: () => Promise.resolve(faker_1.faker.commerce.productDescription()),
            [types_1.PropType.RichText]: () => Promise.resolve(this.seedRichText()),
            [types_1.PropType.Money]: () => Promise.resolve(faker_1.faker.finance.amount({ min: 1, max: 500, dec: 2 })),
            [types_1.PropType.Date]: () => Promise.resolve(faker_1.faker.date.past()),
            [types_1.PropType.Timestamp]: () => Promise.resolve(faker_1.faker.date.recent()),
            [types_1.PropType.Email]: () => Promise.resolve(faker_1.faker.internet.email()),
            [types_1.PropType.Boolean]: () => Promise.resolve(faker_1.faker.datatype.boolean()),
            [types_1.PropType.Password]: () => Promise.resolve(bcryptjs_1.default.hashSync('manifest', 1)),
            [types_1.PropType.Choice]: () => Promise.resolve(this.seedChoice(propertyManifest)),
            [types_1.PropType.Location]: () => Promise.resolve(this.seedLocation()),
            [types_1.PropType.File]: () => this.seedFile(propertyManifest, entityManifest),
            [types_1.PropType.Image]: () => this.seedImage(propertyManifest, entityManifest)
        };
        const handler = typeHandlers[propertyManifest.type];
        if (handler) {
            return handler();
        }
        return Promise.reject(new Error(`Unsupported property type: ${propertyManifest.type}`));
    }
    seedRichText() {
        return `
      <h1>${faker_1.faker.commerce.productName()}</h1>
      <p>This is a dummy HTML content with <a href="https://manifest.build">links</a> and <strong>bold text</strong></p>
      <ul>
        <li>${faker_1.faker.commerce.productAdjective()}</li>
        <li>${faker_1.faker.commerce.productAdjective()}</li>
        <li>${faker_1.faker.commerce.productAdjective()}</li>
      </ul>
      <h2>${faker_1.faker.commerce.productName()}</h2>
      <p>${faker_1.faker.commerce.productDescription()}<p>
    `;
    }
    seedChoice(propertyManifest) {
        return faker_1.faker.helpers.arrayElement(propertyManifest.options.values);
    }
    async seedFile(propertyManifest, entityManifest) {
        const fileKey = `${entityManifest.slug}.${propertyManifest.name}`;
        if (this.seededFiles[fileKey]) {
            return this.seededFiles[fileKey];
        }
        const dummyFileContent = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'assets', constants_1.DUMMY_FILE_NAME));
        const filePath = await this.storageService.store(entityManifest.slug, propertyManifest.name, {
            originalname: constants_1.DUMMY_FILE_NAME,
            buffer: dummyFileContent
        });
        this.seededFiles[fileKey] = filePath;
        return filePath;
    }
    async seedImage(propertyManifest, entityManifest) {
        const imageKey = `${entityManifest.slug}.${propertyManifest.name}`;
        if (this.seededImages[imageKey]) {
            return this.seededImages[imageKey];
        }
        const dummyImageContent = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', 'assets', constants_1.DUMMY_IMAGE_NAME));
        const images = await this.storageService.storeImage(entityManifest.slug, propertyManifest.name, {
            originalname: constants_1.DUMMY_IMAGE_NAME,
            buffer: dummyImageContent
        }, propertyManifest.options?.['sizes']);
        this.seededImages[imageKey] = images;
        return images;
    }
    seedLocation() {
        return {
            lat: faker_1.faker.location.latitude(),
            lng: faker_1.faker.location.longitude()
        };
    }
    async seedAdmin(repository, manifestId) {
        console.log(`✅ Seeding default admin ${constants_1.DEFAULT_ADMIN_CREDENTIALS.email} with password "${constants_1.DEFAULT_ADMIN_CREDENTIALS.password}"...`);
        const admin = repository.create();
        admin.email = constants_1.DEFAULT_ADMIN_CREDENTIALS.email;
        admin.password = bcryptjs_1.default.hashSync(constants_1.DEFAULT_ADMIN_CREDENTIALS.password, 1);
        if (this.configService.get('shouldPrefixTable'))
            admin.tenantId = manifestId;
        await repository.save(admin);
    }
    async seedRelationships(relationshipManifest) {
        const relatedEntityRepository = this.entityService.getEntityRepository({
            entityMetadata: this.entityService.getEntityMetadata({
                className: relationshipManifest.entity
            })
        });
        if (!this.records[relationshipManifest.entity]) {
            this.records[relationshipManifest.entity] =
                await relatedEntityRepository.find({
                    select: ['id']
                });
        }
        if (relationshipManifest.type === 'many-to-one') {
            return this.getRandomUniqueIds(this.records[relationshipManifest.entity].map((item) => item.id), 1)[0];
        }
        else if (relationshipManifest.type === 'many-to-many') {
            const max = Math.min(constants_1.DEFAULT_MAX_MANY_TO_MANY_RELATIONS, this.records[relationshipManifest.entity].length);
            const numberOfRelations = faker_1.faker.number.int({
                min: 0,
                max
            });
            return this.getRandomUniqueIds(this.records[relationshipManifest.entity].map((item) => item.id), numberOfRelations).map((id) => ({ id }));
        }
        else if (relationshipManifest.type === 'one-to-one') {
            return this.getRandomUniqueIds(this.records[relationshipManifest.entity].map((item) => item.id), 1)[0];
        }
    }
    getRandomUniqueIds(ids, count) {
        const shuffled = [...ids].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, ids.length));
    }
};
exports.SeederService = SeederService;
exports.SeederService = SeederService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        entity_service_1.EntityService,
        manifest_service_1.ManifestService,
        entity_manifest_service_1.EntityManifestService,
        storage_service_1.StorageService,
        typeorm_1.DataSource])
], SeederService);
