import { ApiProperty } from '@nestjs/swagger';
import { PriceSizeDto } from './prize-size.dto';

class LimitsDto {
  @ApiProperty({ example: 100 })
  min: number;

  @ApiProperty({ example: 100000 })
  max: number;
}

class StatusDto {
  @ApiProperty({ example: '' })
  gameStatus: string;

  @ApiProperty({ example: '' })
  gtStatus: string;
}

class MetaDto {
  @ApiProperty({ example: 30 })
  serialNo: number;

  @ApiProperty({ example: 30 })
  priority: number;

  @ApiProperty({ example: 'wpmarket' })
  marketName: string;

  @ApiProperty({ example: '2026-03-18T15:11:12.000Z' })
  updatedAt: string;

  @ApiProperty({ example: 1773826872966 })
  timestamp: number;
}

export class SessionResponseDto {
  @ApiProperty()
  marketId: string;

  @ApiProperty()
  selectionId: string;

  @ApiProperty()
  runnerName: string;

  @ApiProperty({ example: 'session' })
  type: string;

  @ApiProperty({ example: true })
  isBallSession: boolean;

  @ApiProperty({ type: [PriceSizeDto] })
  back: PriceSizeDto[];

  @ApiProperty({ type: [PriceSizeDto] })
  lay: PriceSizeDto[];

  @ApiProperty({ type: LimitsDto })
  limits: LimitsDto;

  @ApiProperty({ type: StatusDto })
  status: StatusDto;

  @ApiProperty({ type: MetaDto })
  meta: MetaDto;
}
