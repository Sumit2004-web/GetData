import { Controller, Get, Param } from '@nestjs/common';
import { EventService } from './event.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { EventResponseDto } from './dto/event-response.dto';
import { EventWithCompetitionDto } from './dto';

@ApiTags('Event')
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  // Get events with competition details by original competition ID
  @Get('event-list/:competitionId')
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @ApiOperation({
    summary: 'Get events by competitionId combine data of event & competitions',
  })
  @ApiParam({
    name: 'competitionId',
    example: '12233784',
  })
  @ApiResponse({
    status: 200,
    type: EventWithCompetitionDto,
  })
  getEventwithCompetitions(@Param('competitionId') competitionId: string) {
    return this.eventService.getEventsWithCompetitions(competitionId);
  }

  // Get all events with competition details by sport ID
  @Get('all-events/:sportId')
  @Throttle({ default: { limit: 10, ttl: 60 } })
  @ApiOperation({
    summary: 'Get events by sportId combine data of event & competitions',
  })
  @ApiParam({
    name: 'sportId',
    example: '1',
  })
  @ApiResponse({
    status: 200,
    type: [EventWithCompetitionDto],
  })
  getAllEvents(@Param('sportId') sportId: string) {
    return this.eventService.getAllEvents(sportId);
  }

  // Get events by original competition ID
  @Get(':competitionId')
  @Throttle({ default: { limit: 15, ttl: 60000 } })
  @ApiOperation({ summary: 'Get all events by original competition ID' })
  @ApiParam({
    name: 'competitionId',
    example: '12233784',
    description: 'Original Competition ID (external ID)',
  })
  @ApiResponse({
    status: 200,
    description: 'List of events',
    type: [EventResponseDto],
  })
  async getEvents(@Param('competitionId') competitionId: string) {
    return this.eventService.getEventsByCompetition(competitionId);
  }
}
