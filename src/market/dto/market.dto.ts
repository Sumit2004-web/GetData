import { ApiProperty } from '@nestjs/swagger';

class RunnerDto {
  @ApiProperty({ example: '101' })
  selectionId: string;

  @ApiProperty({ example: 'India' })
  runnerName: string;
}

export class MarketResponseDto {
  @ApiProperty({ example: '1.23456' })
  marketId: string;

  @ApiProperty({ example: 'Match Odds' })
  marketName: string;

  @ApiProperty({ example: 'OPEN' })
  status: string;

  @ApiProperty({ example: true })
  inPlay: boolean;

  @ApiProperty({ example: 0 })
  totalMatched: number;

  @ApiProperty({ type: [RunnerDto] })
  runners: RunnerDto[];
}