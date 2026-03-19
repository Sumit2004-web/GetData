import { ApiProperty } from '@nestjs/swagger';

export class CompetitionResponseDto {
  @ApiProperty({ example: 'cricket' })
  sportName: string;

  @ApiProperty({ example: '4' })
  sportId: string;

  @ApiProperty({ example: 'IPL 2025' })
  competitionName: string;

  @ApiProperty({ example: '12345' })
  competitionId: string;

  @ApiProperty({ example: 'India' })
  competitionRegion: string;

  @ApiProperty({ example: 120 })
  marketCount: number;
}