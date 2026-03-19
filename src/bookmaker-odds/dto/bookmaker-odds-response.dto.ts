import { ApiProperty } from '@nestjs/swagger';

class PriceSizeDto {
  @ApiProperty({ example: '2.3' })
  price1: string;

  @ApiProperty({ example: '130' })
  price: string;

  @ApiProperty({ example: '500000' })
  size: string;
}

class BookmakerOddsExDto {
  @ApiProperty({ type: [PriceSizeDto] })
  availableToBack: PriceSizeDto[];

  @ApiProperty({ type: [PriceSizeDto] })
  availableToLay: PriceSizeDto[];
}

class BookmakerOddsRunnerDto {
  @ApiProperty({ example: 'England' })
  runnerName: string;

  @ApiProperty({ example: '1' })
  selectionId: string;

  @ApiProperty({ example: '1' })
  sortPriority: string;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiProperty({ type: [PriceSizeDto] })
  back: PriceSizeDto[];

  @ApiProperty({ type: [PriceSizeDto] })
  lay: PriceSizeDto[];

  @ApiProperty({ type: BookmakerOddsExDto })
  ex: BookmakerOddsExDto;
}

class BookmakerOddsItemDto {
  @ApiProperty({ example: 'Bookmaker' })
  marketName: string;

  @ApiProperty({ example: '34452308' })
  matchId: string;

  @ApiProperty({ example: '34452308' })
  EventID: string;

  @ApiProperty({ example: 'SUSPENDED' })
  status: string;

  @ApiProperty({ example: '5551.7709831522825_bm1' })
  marketId: string;

  @ApiProperty({ example: 4 })
  sportId: number;

  @ApiProperty({ type: [BookmakerOddsRunnerDto] })
  runners: BookmakerOddsRunnerDto[];
}

export class BookmakerOddsResponseDto {
  @ApiProperty({ example: 'Bookmaker' })
  marketName: string;

  @ApiProperty({ example: '34452308' })
  eventID: string;

  @ApiProperty({ type: [BookmakerOddsItemDto] })
  data: BookmakerOddsItemDto[];
}
