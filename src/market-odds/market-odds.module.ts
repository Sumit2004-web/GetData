import { Module } from '@nestjs/common';
import { RedisModule } from '../redis';
import { MarketOddsController } from './market-odds.controller';
import { MarketOddsService } from './market-odds.service';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [RedisModule,PrismaModule],
  controllers: [MarketOddsController],
  providers: [MarketOddsService],
})
export class MarketOddsModule {}
