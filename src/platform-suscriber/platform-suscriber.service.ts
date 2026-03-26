import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApiUserStatus, Prisma } from '../generated/prisma/client';
import { CreatePlatformSuscriberDto, UpdatePlatformSuscriberDto,PlatformPermissionsDto } from './dto';


@Injectable()
export class PlatformSuscriberService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.platformSuscriber.findMany({
      include: { permissions: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.platformSuscriber.findUnique({
      where: { id },
      include: { permissions: true },
    });
  }

  private mapPermissions(permissions?: PlatformPermissionsDto) {
    if (!permissions) {
      return undefined;
    }

    return {
      sportIds: permissions.sportIds ?? [],
      providerIds: permissions.providerIds ?? [],
      canViewEvents: permissions.canViewEvents ?? true,
      canViewMarkets: permissions.canViewMarkets ?? true,
      canViewOdds: permissions.canViewOdds ?? true,
      canViewSessions: permissions.canViewSessions ?? true,
    };
  }

  async create(input: CreatePlatformSuscriberDto) {
    try {
      return await this.prisma.platformSuscriber.create({
        data: {
          name: input.name,
          ipAddress: input.ipAddress,
          status: input.status || ApiUserStatus.Active,
          permissions: input.permissions
            ? {
                create: this.mapPermissions(input.permissions),
              }
            : undefined,
        },
        include: { permissions: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('API key must be unique');
      }
      throw error;
    }
  }

  async update(id: number, input: UpdatePlatformSuscriberDto) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Platform subscriber not found');
    }

    const data: any = {};
    if (input.name !== undefined) data.name = input.name;
    if (input.ipAddress !== undefined) data.ipAddress = input.ipAddress;
    if (input.status !== undefined) data.status = input.status;

    if (input.permissions !== undefined) {
      const permissionsData = this.mapPermissions(input.permissions);
      if (existing.permissions) {
        data.permissions = {
          update: permissionsData,
        };
      } else {
        data.permissions = {
          create: permissionsData,
        };
      }
    }

    try {
      return this.prisma.platformSuscriber.update({
        where: { id },
        data,
        include: { permissions: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('API key must be unique');
      }
      throw error;
    }
  }

  async remove(id: number) {
    const existing = await this.findOne(id);
    if (!existing) {
      throw new NotFoundException('Platform subscriber not found');
    }

    await this.prisma.platformSuscriber.delete({
      where: { id },
    });
    return { success: true };
  }
}
