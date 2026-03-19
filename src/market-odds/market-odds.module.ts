import { Module } from '@nestjs/common';
import { RedisModule } from '../redis';
import { MarketOddsController } from './market-odds.controller';
import { MarketOddsService } from './market-odds.service';

@Module({
  imports: [RedisModule],
  controllers: [MarketOddsController],
  providers: [MarketOddsService],
})
export class MarketOddsModule {}
