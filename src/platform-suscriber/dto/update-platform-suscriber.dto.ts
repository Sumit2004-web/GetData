import { PartialType } from '@nestjs/swagger';
import { CreatePlatformSuscriberDto } from './create-platform-suscriber.dto';

export class UpdatePlatformSuscriberDto extends PartialType(
  CreatePlatformSuscriberDto,
) {}
