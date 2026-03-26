import { ForbiddenException, Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { SessionResponseDto } from './dto/fancy-response.dto';
import { transformFancyMarket } from './utils/transform.utils';
import { PrismaService } from 'src/prisma';
import { BETFAIR_SPORT_ID_MAP } from 'src/common/constants/sportIdMap';
import { ValidateIpService } from 'src/common/providers/validateIp.service';

@Injectable()
export class FancyService {
  constructor(private readonly redisService: RedisService,
    private readonly prisma:PrismaService,
    private readonly validateIpService:ValidateIpService
  ) {}

  //  Get all fancy markets by eventId
  async getFancyByEventId(eventId: string,ip:string): Promise<SessionResponseDto[]> {
   
    const event = await this.prisma.event.findFirst({
      where:{
        externalId:String(eventId)
      },
      include:{
        competition:true
      }
    })

    if( !event?.competition){
      throw new ForbiddenException('Event Not Found')
    }

    //Get Sport Id
    const sportId=BETFAIR_SPORT_ID_MAP[event.competition.sport]

    if (!sportId) {
      throw new ForbiddenException('Unsupported sport');
    }

    await this.validateIpService.validateIpAccess(
      ip,
      event.competition.providerId,
      sportId
    );
    const redis = this.redisService.client;

    const key = `fancyMarkets:${eventId}`;

    const data = await redis.hgetall(key);

    if (!data || Object.keys(data).length === 0) return [];

    return Object.values(data)
      .map((val) => {
        try {
          return transformFancyMarket(JSON.parse(val));
        } catch {
          return null;
        }
      })
      .filter((market): market is SessionResponseDto => market !== null);
  }
}
