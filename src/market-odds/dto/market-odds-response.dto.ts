import { ApiProperty } from '@nestjs/swagger';

class PriceSizeDto {
  @ApiProperty({ example: 1.03 })
  price: number;

  @ApiProperty({ example: 100 })
  size: number;
}

class RunnerDto {
  @ApiProperty({ example: '13' })
  selectionId: string;

  @ApiProperty({ example: 'under 16.5' })
  runnerName: string;

  @ApiProperty({ type: [PriceSizeDto] })
  back: PriceSizeDto[];

  @ApiProperty({ type: [PriceSizeDto] })
  lay: PriceSizeDto[];
}

export class MarketOddsResponseDto {
  @ApiProperty({ example: '190' })
  marketId: string;

  @ApiProperty()
  marketName: string;

  @ApiProperty()
  matchId: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  inplay: boolean;

  @ApiProperty({ type: [RunnerDto] })
  runners: RunnerDto[];
}