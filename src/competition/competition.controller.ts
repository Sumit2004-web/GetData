import { Controller, Get, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CompetitionService } from './competition.service';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CompetitionResponseDto } from './dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Competition')
@Controller('competition')
export class CompetitionController {
  constructor(private readonly competitionService: CompetitionService) {}
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
  getAllCompetition(@Param('sportId', ParseIntPipe) sportId: number) {
    return this.competitionService.getCompetitionsBySportDefaultProvider(
      sportId,
    );
  }
}
