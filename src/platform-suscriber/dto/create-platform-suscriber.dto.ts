import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsIP,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayNotEmpty,
  ArrayUnique,
  IsInt,
  Min,
} from 'class-validator';
import { ApiUserStatus } from '../../generated/prisma/client';

export class PlatformPermissionsDto {
  @ApiPropertyOptional({ example: [1, 2] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  sportIds?: number[];

  @ApiPropertyOptional({ example: [1, 3] })
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(1, { each: true })
  providerIds?: number[];

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  canViewEvents?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  canViewMarkets?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  canViewOdds?: boolean;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  canViewSessions?: boolean;
}

export class CreatePlatformSuscriberDto {
  @ApiProperty({ example: 'Subscriber Name' })
  @IsString()
  @IsNotEmpty()
  name: string;


  @ApiProperty({ example: '192.168.0.1' })
  @IsIP()
  ipAddress: string;

  @ApiProperty({ enum: ApiUserStatus, example: ApiUserStatus.Active })
  @IsEnum(ApiUserStatus)
  status: ApiUserStatus;

  @ApiPropertyOptional({ type: PlatformPermissionsDto })
  @IsOptional()
  permissions?: PlatformPermissionsDto;
}
