import { Controller, Get, Param } from '@nestjs/common';
import { FancyService } from './fancy.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SessionResponseDto } from './dto/fancy-response.dto';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Fancy (Session)')
@Controller('fancy')
export class FancyController {
  constructor(private readonly fancyService: FancyService) {}

  @Get('event/:eventId')
  @ApiOperation({ summary: 'Get all fancy (session) markets by eventId' })
  @ApiParam({ name: 'eventId', example: '69832836' })
  @ApiResponse({
    status: 200,
    description: 'List of fancy markets',
    type: [SessionResponseDto],
  })
  async getFancyByEvent(@Param('eventId') eventId: string) {
    return this.fancyService.getFancyByEventId(eventId);
  }
}
