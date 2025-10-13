"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../../app.module");
const seeder_service_1 = require("../services/seeder.service");
async function bootstrap() {
    core_1.NestFactory.createApplicationContext(app_module_1.AppModule, {
        logger: ['error', 'warn']
    })
        .then((appContext) => {
        console.log('🌱 Seeding database...');
        appContext
            .get(seeder_service_1.SeederService)
            .seed()
            .then(() => {
            console.log('🌱 Seed complete ! Please refresh your browser to see your new data.');
        })
            .catch((error) => {
            console.error('Seeding failed!');
            throw error;
        })
            .finally(() => appContext.close());
    })
        .catch((error) => {
        throw error;
    });
}
bootstrap();
