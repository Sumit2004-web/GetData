import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { BookmakerOddsService } from './bookmaker-odds.service';
import { BookmakerOddsResponseDto } from './dto';

@ApiTags('Bookmaker Odds')
@Controller('bookmaker/odds')
export class BookmakerOddsController {
  constructor(private readonly service: BookmakerOddsService) {}

  @Get()
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Get bookmaker odds (supports single or comma-separated marketIds)' })
  @ApiQuery({ name: 'marketId', example: '5551.7709831522825_bm1' })
  @ApiResponse({ status: 200, type: BookmakerOddsResponseDto })
  async getOdds(@Query('marketId') marketId: string) {
    const marketIds = (marketId || '').split(',').map((m) => m.trim()).filter(Boolean);
    return this.service.getOddsForMarketIds(marketIds);
  }

  @Get('single')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Get bookmaker odds for a single marketId' })
  @ApiQuery({ name: 'marketId', example: '5551.7709831522825_bm1' })
  @ApiResponse({ status: 200, type: BookmakerOddsResponseDto })
  async getOddsSingle(@Query('marketId') marketId: string) {
    const response = await this.service.getOddsByMarketId(marketId);
    return {
      marketName: 'Bookmaker',
      eventID: response?.EventID ?? '',
      data: response ? [response] : [],
    };
  }
}
