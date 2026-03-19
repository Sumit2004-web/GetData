import { Controller, Get, Param, Query } from '@nestjs/common';
import { MarketOddsService } from './market-odds.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { MarketOddsResponseDto } from './dto';

@ApiTags('Market Odds')
@Controller('market-odds')
export class MarketOddsController {
  constructor(private readonly service: MarketOddsService) {}

  @Get('match/:matchId')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Get market odds by matchId' })
  @ApiParam({
    name: 'matchId',
    example: '69832836',
  })
  @ApiResponse({
    status: 200,
    type: [MarketOddsResponseDto],
  })
  async getOdds(@Param('matchId') matchId: string) {
    return this.service.getMarketOdds(matchId);
  }

  
 
  @Get('market/:marketId')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Get market odds by marketId' })
   @ApiParam({
    name: 'marketId',
    example: '9.226031719390004',
  })
  @ApiResponse({
    status: 200,
    type: MarketOddsResponseDto,
  })
  async getMarketById(@Param('marketId') marketId: string) {
    return this.service.getMarketById(marketId);
  }

    @Get('getMarketOdds')
    @Throttle({ default: { limit: 20, ttl: 60000 } })
    @ApiOperation({ summary: 'Get market odds for one or more market_ids' })
    @ApiQuery({ name: 'market_id', example: '1.245074690,1.245074692' })
    @ApiResponse({ status: 200, type: [MarketOddsResponseDto] })
    async getMarketOdds(@Query('market_id') marketId: string) {
      const marketIds = (marketId || '')
        .split(',')
        .map((m) => m.trim())
        .filter(Boolean);
  
      return this.service.getMarketOddsByIds(marketIds);
    }

}
