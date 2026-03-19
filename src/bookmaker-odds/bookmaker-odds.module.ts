import { Module } from '@nestjs/common';
import { RedisModule } from '../redis';
import { BookmakerOddsController } from './bookmaker-odds.controller';
import { BookmakerOddsService } from './bookmaker-odds.service';

@Module({
  imports: [RedisModule],
  controllers: [BookmakerOddsController],
  providers: [BookmakerOddsService],
})
export class BookmakerOddsModule {}
