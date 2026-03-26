import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { BETFAIR_SPORT_ID_MAP } from 'src/common/constants/sportIdMap';
import { PrismaService } from 'src/prisma';
import { ValidateIpService } from 'src/common/providers/validateIp.service';

@Injectable()
export class BookmakerOddsService {
  private readonly logger = new Logger(BookmakerOddsService.name);

  constructor(private readonly redisService: RedisService,
    private readonly prisma:PrismaService,
    private readonly validateIpService:ValidateIpService
  ) {}

 

  async getOddsForMarketIds(marketIds: string[],ip :string) {
    const redis = this.redisService.client;

    const normalizedIds = marketIds
      .map((id) => String(id || '').trim())
      .filter(Boolean);

    const data = [];

    for (const id of normalizedIds) {
    //   const market = await this.prisma.market.findFirst({
    //   where: { externalId: id },
    //   include: {
    //     event: {
    //       include: {
    //         competition: true,
    //       },
    //     },
    //   },
    // });

    // //  If not found → skip
    // if (!market?.event?.competition) {
    //   continue;
    // }

    // const sportId = BETFAIR_SPORT_ID_MAP[market.event.competition.sport];

    // //  Validate IP
    // await this.validateIpService.validateIpAccess(
    //   ip,
    //   market.event.competition.providerId,
    //   sportId
    // );
      const value = await this.loadFromRedis(redis, id);
      if (!value) continue;

      data.push(value);
    }

    return {
      marketName: 'Bookmaker',
      eventID: data.length ? (data[0].matchId ?? '') : '',
      data,
    };
  }

  private async loadFromRedis(redis: any, marketId: string) {
    const raw = await redis.get(`BookmakerOdds:${marketId}`);

    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);

      //  payload wraps data inside `data`, unwrap it.
      if (parsed && typeof parsed === 'object' && 'data' in parsed) {
        return parsed.data;
      }

      return parsed;
    } catch (err) {
      this.logger.warn(
        `Failed to parse redis value for marketId=${marketId}`,
        err?.message,
      );
      return null;
    }
  }
}
