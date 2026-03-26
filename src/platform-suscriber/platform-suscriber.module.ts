import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma';
import { PlatformSuscriberService } from './platform-suscriber.service';
import { PlatformSuscriberController } from './platform-suscriber.controller';

@Module({
  imports: [PrismaModule],
  controllers: [PlatformSuscriberController],
  providers: [PlatformSuscriberService],
})
export class PlatformSuscriberModule {}
