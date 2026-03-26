import { Module } from '@nestjs/common';
import { RedisModule } from '../redis';
import { BookmakerOddsController } from './bookmaker-odds.controller';
import { BookmakerOddsService } from './bookmaker-odds.service';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [RedisModule,PrismaModule],
  controllers: [BookmakerOddsController],
  providers: [BookmakerOddsService],
})
export class BookmakerOddsModule {}
