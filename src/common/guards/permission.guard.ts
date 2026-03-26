import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from 'src/prisma';
import { BaseController } from '../base';
import { Permissionkey } from '../decorators';

@Injectable()
export class PermissionGuard extends BaseController implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const requiredPermission = this.reflector.get<Permissionkey>(
      'permission',
      context.getHandler(),
    );

    if (!requiredPermission) return true;

    const ip=this.getIp(req)   

    if (!ip) {
      throw new ForbiddenException('IP not found');
    }
    
    //attach ip to request
    req.clientIp=ip

    const subscriber = await this.prisma.platformSuscriber.findFirst({
      where: { ipAddress: ip },
      include: { permissions: true },
    });

    if (!subscriber) {
      throw new ForbiddenException('Subscriber not found');
    }

    if (!subscriber.permissions?.[requiredPermission]) {
      throw new ForbiddenException('Permission denied');
    }

    return true;
  }
}