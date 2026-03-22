import { ApiProperty } from '@nestjs/swagger';

class EventDto {
  @ApiProperty({ example: '28529194' })
  id: string;

  @ApiProperty({ example: 'India vs Australia' })
  name: string;

  @ApiProperty({ example: 'IN' })
  countryCode: string;

  @ApiProperty({ example: 'GMT' })
  timezone: string;

  @ApiProperty({ example: '2026-03-20T10:00:00.000Z' })
  openDate: string;
}

export class EventResponseDto {
  @ApiProperty({ type: EventDto })
  event: EventDto;

  @ApiProperty({ example: 1 })
  marketCount: number;

  @ApiProperty({ example: '' })
  scoreboard_id: string;

  @ApiProperty({ example: null, nullable: true })
  selections: any;

  @ApiProperty({ example: '0' })
  liability_type: string;

  @ApiProperty({ example: 1 })
  undeclared_markets: number;
}
