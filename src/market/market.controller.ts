import { Controller, ForbiddenException, Get, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { MarketService } from './market.service';
import { MarketResponseDto } from './dto';
import { BaseController, RequirePermission } from '@Common';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { Request } from 'express';

@ApiTags('Market')
@Controller('markets')
export class MarketController extends BaseController {
  constructor(private readonly marketService: MarketService) {
    super()
  }

  @Get(':eventId')
  @UseGuards(PermissionGuard)
  @RequirePermission('canViewMarkets')
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
  async getMarkets(@Param('eventId') eventId: string,@Req() req:Request) {
    const ip=this.getIp(req)
    if(!ip){
      throw new ForbiddenException("Unable to determine client Ip address")
    }
    return this.marketService.getMarketsByEvent(eventId,ip);
  }
}
