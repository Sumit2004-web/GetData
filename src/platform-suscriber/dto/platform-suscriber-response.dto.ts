import { ApiProperty } from '@nestjs/swagger';
import { ApiPermissionsResponseDto } from './platform-permissions-response.dto';
import { ApiUserStatus } from '../../generated/prisma/client';

export class PlatformSuscriberResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'External Subscriber Name' })
  name: string;


  @ApiProperty({ example: '192.168.0.1' })
  ipAddress: string;

  @ApiProperty({ enum: ApiUserStatus, example: ApiUserStatus.Active })
  status: ApiUserStatus;

  @ApiProperty({ example: '2026-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-01-01T01:00:00.000Z' })
  updatedAt: Date;

  @ApiProperty({ type: ApiPermissionsResponseDto, nullable: true })
  permissions?: ApiPermissionsResponseDto | null;
}
