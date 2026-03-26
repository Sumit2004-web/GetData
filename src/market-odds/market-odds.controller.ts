import { Controller, ForbiddenException, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { MarketOddsService } from './market-odds.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { MarketOddsResponseDto } from './dto';
import { BaseController, RequirePermission } from '@Common';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Request } from 'express';

@ApiTags('Market Odds')
@Controller('market-odds')
export class MarketOddsController extends BaseController {
  constructor(private readonly service: MarketOddsService) {
    super()
  }

  @Get('match/:matchId')
  @UseGuards(PermissionGuard)
  @RequirePermission('canViewOdds')
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
  async getOdds(@Param('matchId') matchId: string,@Req() req:Request) {
    const ip=this.getIp(req)
    if(!ip){
      throw new ForbiddenException("Unable to determine client Ip address")
    }
    return this.service.getMarketOdds(matchId,ip);
  }

  @Get('market/:marketId')
  @UseGuards(PermissionGuard)
  @RequirePermission('canViewOdds')
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
  async getMarketById(@Param('marketId') marketId: string,@Req() req:Request) {
    const ip=this.getIp(req)
    if(!ip){
      throw new ForbiddenException("Unable to determine client Ip address")
    }
    return this.service.getMarketById(marketId,ip);
  }

  @Get('getMarketOdds')
  @UseGuards(PermissionGuard)
  @RequirePermission('canViewOdds')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  @ApiOperation({ summary: 'Get market odds for one or more market_ids' })
  @ApiQuery({ name: 'market_id', example: '1.245074690,1.245074692' })
  @ApiResponse({ status: 200, type: [MarketOddsResponseDto] })
  async getMarketOdds(@Query('market_id') marketId: string,@Req() req:Request) {
    const ip=this.getIp(req)
    if(!ip){
      throw new ForbiddenException("Unable to determine client Ip address")
    }

    const marketIds = (marketId || '')
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
    return this.service.getMarketOddsByIds(marketIds,ip);
  }
}
