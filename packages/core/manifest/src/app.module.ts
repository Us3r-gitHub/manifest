import * as path from 'path'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { TypeOrmModule } from '@nestjs/typeorm'
import { AppManifest, AppSettings, DatabaseConnection } from '@repo/types'
import { EntitySchema } from 'typeorm'
import { AuthModule } from './auth/auth.module'
import { CrudModule } from './crud/crud.module'
import { EntityModule } from './entity/entity.module'
import { EntityLoaderService } from './entity/services/entity-loader.service'
import { LoggerModule } from './logger/logger.module'
import { LoggerService } from './logger/logger.service'
import { ManifestModule } from './manifest/manifest.module'
import { SeedModule } from './seed/seed.module'
import { HealthModule } from './health/health.module'
import { OpenApiModule } from './open-api/open-api.module'
import { ValidationModule } from './validation/validation.module'
import { UploadModule } from './upload/upload.module'
import { StorageModule } from './storage/storage.module'
import { ManifestService } from './manifest/services/manifest.service'
import { HookModule } from './hook/hook.module'
import { EndpointModule } from './endpoint/endpoint.module'
import { PolicyModule } from './policy/policy.module'
import { HandlerModule } from './handler/handler.module'
import { SdkModule } from './sdk/sdk.module'
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions'
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions'
import { MiddlewareModule } from './middleware/middleware.module'
import { EventModule } from './event/event.module'

import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions'
import config from './config/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { TenantBasedThrottlerGuard } from './tenant-based-throttler-guard'
import { APP_GUARD } from '@nestjs/core'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '.env.contribution'],
      load: [config]
    }),
    // TODO-Next: Implement dynamic connection for multiple DB
    // NOTE: Try to implement `Conditional module configuration` https://docs.nestjs.com/techniques/configuration#conditional-module-configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule, EntityModule, ManifestModule],
      useFactory: async (
        configService: ConfigService,
        entityLoaderService: EntityLoaderService,
        manifestService: ManifestService
      ) => {
        let dbConnection: DatabaseConnection
        let databaseConfig:
          | SqliteConnectionOptions
          | PostgresConnectionOptions
          | MysqlConnectionOptions

        switch (configService.get('DB_CONNECTION')) {
          case 'postgres':
            dbConnection = 'postgres'
            databaseConfig = configService.get('database').postgres
            break
          case 'mysql':
            dbConnection = 'mysql'
            databaseConfig = configService.get('database').mysql
            break
          default:
            dbConnection = 'sqlite'
            databaseConfig = configService.get('database').sqlite()
            break
        }

        const entities: EntitySchema[] = []
        if (configService.get('isMultiTenant')) {
          const manifestFiles: string[] = configService.get('manifestFiles')
          for (const manifestFile of manifestFiles) {
            const manifestId = path.basename(path.dirname(manifestFile))

            manifestService.setManifestId(manifestId)

            await manifestService.loadManifest(manifestFile)

            const appManifestEntities =
              entityLoaderService.loadEntities(dbConnection)

            entities.push(...appManifestEntities)
          }
        } else {
          await manifestService.loadManifest(
            configService.get('paths').manifestFile
          )

          const appManifestEntities =
            entityLoaderService.loadEntities(dbConnection)

          entities.push(...appManifestEntities)
        }

        return Object.assign(databaseConfig, { entities })
      },
      inject: [ConfigService, EntityLoaderService, ManifestService]
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule, EntityModule, ManifestModule],
      useFactory: async (
        configService: ConfigService,
        manifestService: ManifestService
      ) => {
        const rateLimits: AppSettings['rateLimits'] = []

        if (configService.get('isMultiTenant')) {
          const manifestFiles: string[] = configService.get('manifestFiles')
          for (const manifestFile of manifestFiles) {
            const manifestId = path.basename(path.dirname(manifestFile))

            manifestService.setManifestId(manifestId)

            const appManifest: AppManifest =
              await manifestService.loadManifest(manifestFile)

            const appManifestRateLimits = (
              appManifest.settings.rateLimits || []
            ).map((rateLimit) => ({
              ...rateLimit,
              name: `${manifestId}_tenant_${rateLimit.name || 'default'}`
            }))
            rateLimits.push(...appManifestRateLimits)
          }
        } else {
          await manifestService.loadManifest(
            configService.get('paths').manifestFile
          )

          const appManifest: AppManifest = manifestService.getAppManifest()

          rateLimits.push(...(appManifest.settings.rateLimits || []))
        }

        return rateLimits
      },
      inject: [ConfigService, ManifestService, EntityLoaderService]
    }),
    ManifestModule,
    EntityModule,
    SeedModule,
    CrudModule,
    AuthModule,
    LoggerModule,
    HealthModule,
    OpenApiModule,
    ValidationModule,
    UploadModule,
    StorageModule,
    HookModule,
    EndpointModule,
    PolicyModule,
    HandlerModule,
    SdkModule,
    MiddlewareModule,
    EventModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: TenantBasedThrottlerGuard
    }
  ]
})
export class AppModule {
  constructor(private loggerService: LoggerService) {}

  async onModuleInit() {
    await this.init()
  }

  private async init() {
    const isSeed: boolean = process.argv[1].includes('seed')
    const isTest: boolean = process.env.NODE_ENV === 'test'

    if (!isSeed && !isTest) {
      this.loggerService.initMessage()
    }
  }
}
