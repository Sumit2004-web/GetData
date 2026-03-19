import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { MarketService } from './market.service';
import { MarketResponseDto } from './dto';

@ApiTags('Market')
@Controller('markets')
export class MarketController {
  constructor(private readonly marketService: MarketService) {}

  @Get(':eventId')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Get markets by eventId' })
  @ApiParam({
    name: 'eventId',
    example: 123,
    description: 'Event ID',
  })
  @ApiResponse({
    status: 200,
    description: 'List of markets',
    type: [MarketResponseDto],
  })
  async getMarkets(
    @Param('eventId', ParseIntPipe) eventId: number,
  ) {
    return this.marketService.getMarketsByEvent(eventId);
  }
}