import { ApiProperty } from '@nestjs/swagger';

class EventInfoDto {
  @ApiProperty({ example: 34452308 })
  id: number | string;

  @ApiProperty({ example: 'England v India' })
  name: string;

  @ApiProperty({ example: 'GMT' })
  timezone: string;

  @ApiProperty({ example: '2025-07-02T10:00:00.000Z' })
  openDate: string;
}

class MatchItemDto {
  @ApiProperty({ type: EventInfoDto })
  event: EventInfoDto;

  @ApiProperty({ example: '' })
  marketCount: string;

  @ApiProperty({ example: 34452308 })
  matchId: number | string;

  @ApiProperty({ example: 4 })
  gameId: number;

  @ApiProperty({ example: 'England v India' })
  name: string;

  @ApiProperty({ example: 4 })
  seriesId: number;

  @ApiProperty({ example: true })
  active: boolean;
}

export class EventWithCompetitionDto {
  @ApiProperty({
    type: Object,
    example: { id: '11365612', name: 'Test Matches' },
  })
  competition: { id: string; name: string };

  @ApiProperty({ example: '' })
  competitionRegion: string;

  @ApiProperty({ example: '' })
  marketCount: string;

  @ApiProperty({ type: [MatchItemDto] })
  match: MatchItemDto[];
}
