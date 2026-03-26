import { ApiProperty } from '@nestjs/swagger';

export class ApiPermissionsResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ type: [Number], example: [1, 2] })
  sportIds: number[];

  @ApiProperty({ type: [Number], example: [1, 2] })
  providerIds: number[];

  @ApiProperty({ example: true })
  canViewEvents: boolean;

  @ApiProperty({ example: true })
  canViewMarkets: boolean;

  @ApiProperty({ example: true })
  canViewOdds: boolean;

  @ApiProperty({ example: true })
  canViewSessions: boolean;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
