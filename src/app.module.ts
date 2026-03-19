import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MulterModule } from '@nestjs/platform-express';
import { ScheduleModule } from '@nestjs/schedule';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { CommonModule, StorageService, UtilsService } from '@Common';
import { appConfigFactory } from '@Config';
import { AppController } from './app.controller';
import { AppCacheInterceptor } from './app-cache.interceptor';
import { MetricsInterceptor, MetricsModule, MetricsService } from './metrics';
import { PrismaModule } from './prisma';
import { AuthModule } from './auth';
import { RedisModule } from './redis';
import { CompetitionModule } from './competition';
import { ThrottlerGuard, ThrottlerModule, ThrottlerStorageService } from '@nestjs/throttler';
import { EventModule } from './event';
import { MarketModule } from './market';
import { MarketOddsModule } from './market-odds/market-odds.module';
import { BookmakerOddsModule } from './bookmaker-odds/bookmaker-odds.module';
import { FancyModule } from './fancy';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: (storageService: StorageService) => ({
        ...storageService.defaultMulterOptions,
      }),
      inject: [StorageService],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (appConfig: ConfigType<typeof appConfigFactory>) => ({
        ttl: appConfig.cacheTtl,
      }),
      inject: [appConfigFactory.KEY],
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'default',
          ttl: 60000, // Time in milliseconds
          limit: 20, // Max requests
        },
      ],
      storage: new ThrottlerStorageService(),
      skipIf: () => false, // Set to true to disable throttling globally during development
    }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    CommonModule,
    MetricsModule,
    PrismaModule,
    RedisModule,
    AuthModule,
    CompetitionModule,
    EventModule,
    MarketModule,
    MarketOddsModule,
    BookmakerOddsModule,
    FancyModule
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: (
        utilsService: UtilsService,
        metricsService: MetricsService,
      ) => {
        if (utilsService.isMetricsEnabled()) {
          return new MetricsInterceptor(metricsService);
        }
      },
      inject: [UtilsService, MetricsService],
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AppCacheInterceptor,
    },
   {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },

  ],
})
export class AppModule {}
