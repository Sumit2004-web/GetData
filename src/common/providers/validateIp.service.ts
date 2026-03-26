import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma";


@Injectable()
export class ValidateIpService{
  constructor(private readonly prisma:PrismaService){}
     async validateIpAccess(ip: string, providerId: number, sportId: number): Promise<void> {
      const platformSubscriber = await this.prisma.platformSuscriber.findFirst({
        where: { ipAddress: ip },
        include: { permissions: true },
      });
  
      // If no subscriber found with this IP, deny access
      if (!platformSubscriber) {
        throw new ForbiddenException(
          'Your IP address is not authorized to access this service',
        );
      }
  
      // Check if subscriber is active
      const activeStatus = 'Active';
      if (platformSubscriber.status !== activeStatus) {
        throw new ForbiddenException(
          'Your account is not active. Please contact administrator.',
        );
      }
  
      // // If permissions exist, check if provider is allowed
      // if (
      //   platformSubscriber.permissions &&
      //   platformSubscriber.permissions.providerIds &&
      //   platformSubscriber.permissions.providerIds.length > 0
      // ) {
      //   console.log(providerId)
      //   const allowedProviders = platformSubscriber.permissions.providerIds;
      //   if (!allowedProviders.includes(providerId)) {
      //     throw new ForbiddenException(
      //       'You do not have permission to access this provider',
      //     );
      //   }
      // }
      if (!platformSubscriber.permissions?.providerIds?.includes(providerId)) {
  throw new ForbiddenException(
    'You do not have permission to access this provider',
  );
}
  
      // If permissions exist, check if sport is allowed
      // if (
      //   platformSubscriber.permissions &&
      //   platformSubscriber.permissions.sportIds &&
      //   platformSubscriber.permissions.sportIds.length > 0
      // ) {
      //   const allowedSports = platformSubscriber.permissions.sportIds;
      //   if (!allowedSports.includes(sportId)) {
      //     throw new ForbiddenException(
      //       'You do not have permission to access competitions for this sport',
      //     );
      //   }
      // }
      if (!platformSubscriber.permissions?.sportIds?.includes(sportId)) {
        throw new ForbiddenException(
       'You do not have permission to access this sport',
       );
     }
    }
}
