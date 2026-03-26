import { Request } from 'express';
import { Controller, Get, Body, Param, ParseIntPipe, Req, BadRequestException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { BaseController } from '@Common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompetitionResponseDto } from './dto';
import { CompetitionService } from './competition.service';


@ApiTags('Competition')
@Controller('competition')
export class CompetitionController extends BaseController {
  constructor(
    private readonly competitionService: CompetitionService,
  ) {
    super();
  }

  @Get('/:sportId')
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute per IP
  @ApiOperation({
    summary: 'Get competitions by sport Id using default provider',
  })
  @ApiParam({
    name: 'sportId',
    example: 1,
    description: 'Sport Id To fetch Competition (e.g Cricket:1,football:2)',
  })
  @ApiResponse({
    status: 200,
    description: 'list of competitions',
    type: [CompetitionResponseDto],
  })
  async getAllCompetition(
    @Param('sportId', ParseIntPipe) sportId: number,
    @Req() req: Request,
  ) {
    const ip = this.getIp(req);
    console.log(ip)
    if (!ip) {
      throw new BadRequestException('Unable to determine client IP address');
    }

    return this.competitionService.getCompetitionsBySportDefaultProvider(
      sportId,
      ip,
    );
  }
}
