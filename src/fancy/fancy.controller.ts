import { Controller, ForbiddenException, Get, Param, Req, UseGuards } from '@nestjs/common';
import { FancyService } from './fancy.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { SessionResponseDto } from './dto/fancy-response.dto';
import { Throttle } from '@nestjs/throttler';
import { PermissionGuard } from 'src/common/guards/permission.guard';
import { BaseController, RequirePermission } from '@Common';
import { Request } from 'express';

@ApiTags('Fancy (Session)')
@Controller('fancy')
export class FancyController extends BaseController {
  constructor(private readonly fancyService: FancyService) {
    super()
  }

  @Get('event/:eventId')
  @UseGuards(PermissionGuard)
  @RequirePermission('canViewSessions')
  @ApiOperation({ summary: 'Get all fancy (session) markets by eventId' })
  @ApiParam({ name: 'eventId', example: '69832836' })
  @ApiResponse({
    status: 200,
    description: 'List of fancy markets',
    type: [SessionResponseDto],
  })
  async getFancyByEvent(@Param('eventId') eventId: string,@Req() req:Request) {
    const ip= this.getIp(req)
    if(!ip){
      throw new ForbiddenException('')
    }
    return this.fancyService.getFancyByEventId(eventId,ip);
  }
}
