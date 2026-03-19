import { ApiProperty } from '@nestjs/swagger';

export class PriceSizeDto {
  @ApiProperty({ example: 4 })
  price: number;

  @ApiProperty({ example: 100 })
  size: number;
}