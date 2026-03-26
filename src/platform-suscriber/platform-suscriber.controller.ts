import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { PlatformSuscriberResponseDto } from './dto/platform-suscriber-response.dto';
import { PlatformSuscriberService } from './platform-suscriber.service';
import { CreatePlatformSuscriberDto, UpdatePlatformSuscriberDto } from './dto';

@ApiTags('PlatformSuscriber')
@Controller('platform-subscribers')
export class PlatformSuscriberController {
  constructor(private readonly platformSuscriberService: PlatformSuscriberService) {}

  @Get()
  @ApiOperation({ summary: 'Get all platform subscribers' })
  @ApiResponse({ status: 200, type: [PlatformSuscriberResponseDto] })
  getAll() {
    return this.platformSuscriberService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get platform subscriber by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 200, type: PlatformSuscriberResponseDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async getById(@Param('id', ParseIntPipe) id: number) {
    const result = await this.platformSuscriberService.findOne(id);
    if (!result) {
      throw new NotFoundException('Platform subscriber not found');
    }
    return result;
  }

  @Post()
  @ApiOperation({ summary: 'Create new platform subscriber' })
  @ApiBody({ type: CreatePlatformSuscriberDto })
  @ApiResponse({ status: 201, type: PlatformSuscriberResponseDto })
  create(@Body() input: CreatePlatformSuscriberDto) {
    return this.platformSuscriberService.create(input);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update platform subscriber by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiBody({ type: UpdatePlatformSuscriberDto })
  @ApiResponse({ status: 200, type: PlatformSuscriberResponseDto })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdatePlatformSuscriberDto,
  ) {
    return this.platformSuscriberService.update(id, input);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete platform subscriber by id' })
  @ApiParam({ name: 'id', example: 1 })
  @ApiResponse({ status: 204, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.platformSuscriberService.remove(id);
    return { status: 'deleted' };
  }
}
