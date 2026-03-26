import { Request } from 'express';
import { BaseController, RequirePermission } from '@Common';
import { BadRequestException, Controller, ForbiddenException, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { PrismaService } from 'src/prisma';
import { EventWithCompetitionDto } from './dto';
import { EventService } from './event.service';
import { EventResponseDto } from './dto/event-response.dto';
import { PermissionGuard } from 'src/common/guards/permission.guard';

@ApiTags('Event')
@Controller('events')
export class EventController extends BaseController {
  constructor(private readonly eventService: EventService,
    private readonly prisma:PrismaService
  ) {
    super();
  }

  // Get events with competition details by original competition ID
  @Get('event-list/:competitionId')
  @UseGuards(PermissionGuard)
  @RequirePermission('canViewEvents')
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
  async getEventwithCompetitions(@Param('competitionId') competitionId: string,@Req() req:Request) {
    const ip= this.getIp(req)
    if(!ip){
            throw new ForbiddenException('IP not found');
    }
    return this.eventService.getEventsWithCompetitions(competitionId,ip);
  }

  // Get all events with competition details by sport ID
  @Get('all-events/:sportId')
  @UseGuards(PermissionGuard)
  @RequirePermission('canViewEvents')
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
 async getAllEvents(@Param('sportId') sportId: string,@Req() req:Request) {
    const ip=this.getIp(req)
    if(!ip){
      throw new BadRequestException('Unable to determine client Ip address')
    }
    return this.eventService.getAllEvents(sportId,ip);
  }

  // Get events by original competition ID
  @Get(':competitionId')
  @UseGuards(PermissionGuard)
  @RequirePermission('canViewEvents')
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
  async getEvents(@Param('competitionId') competitionId: string,
  @Req() req:Request) {

    const ip = this.getIp(req);
    console.log('Client IP:', ip);
        if (!ip) {
          throw new BadRequestException('Unable to determine client IP address');
        }
    const platformSubscriber= await this.prisma.platformSuscriber.findFirstOrThrow({
      where:{
        ipAddress:ip
      },
      include:{
        permissions:true
      }
    })
    if (!platformSubscriber.permissions?.canViewEvents) {
        throw new ForbiddenException('You are not allowed to view events');
    }   
    return this.eventService.getEventsByCompetition(competitionId,ip);
  }
}
