import { ForbiddenException, Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { BETFAIR_SPORT_ID_MAP } from 'src/common/constants/sportIdMap';
import { PrismaService } from 'src/prisma';
import { ValidateIpService } from 'src/common/providers/validateIp.service';

@Injectable()
export class MarketOddsService {
  constructor(private readonly redisService: RedisService,
    private readonly prisma:PrismaService,
    private readonly validateIpService:ValidateIpService
  ) {}

  async getMarketOdds(matchId: string,ip:string) {


  // //  Find event
  // const event = await this.prisma.event.findFirst({
  //   where: { externalId: matchId },
  //   include: { competition: true },
  // });

  // if (!event || !event.competition) {
  //   return [];
  // }

  // //  Get sportId
  // const sport = event.competition.sport;
  // const providerId = event.competition.providerId;

  // const sportId = BETFAIR_SPORT_ID_MAP[sport];

  // //   Validate access
  // await this.validateIpService.validateIpAccess(
  //   ip,
  //   providerId,
  //   sportId
  // );



    const redis = this.redisService.client;
    const matchIdStr = String(matchId);

    //  try to find relevant keys in Redis
    const patterns = [
      `marketOdds:*:sr:match:${matchIdStr}:*`,
      `marketOdds:*:sr:match:${matchIdStr}`,
      `marketOdds:*:${matchIdStr}:*`,
      `marketOdds:*:${matchIdStr}`,
    ];

    let keys: string[] = [];
    for (const pattern of patterns) {
      keys = await redis.keys(pattern);
      if (keys.length) break;
    }

    // Last resort: scan all marketOdds keys and filter by matchId in payload
    if (!keys.length) {
      keys = await redis.keys('marketOdds:*');
    }

    const result = [];

    for (const key of keys) {
      try {
        const value = await redis.get(key);
        if (!value) continue;

        const parsed = JSON.parse(value);

        const data = parsed.data;

        // Only return items that actually belong to the requested matchId.
        // This prevents accidental partial matches (e.g., matchId "1" matching "199").
        if (String(data.matchId) !== matchIdStr) continue;
        result.push({
          marketId: data.marketId,
          marketName: data.marketName,
          matchId: data.matchId,
          status: data.status,
          inplay: data.inplay,
          runners: data.runners.map((r: any) => ({
            selectionId: r.selectionId,
            runnerName: r.runnerName,
            back: r.back || [],
            lay: r.lay || [],
          })),
        });
      } catch (err) {
        console.error('Error parsing key:', key);
      }
    }

    return result;
  }

  async getMarketById(marketId: string,ip:string) {

    const raw = await this.getRawMarketData(marketId);
    if (!raw) {
      throw new Error(`Market not found for marketId ${marketId}`);
    }
   
    //  Find event using matchId
  // const event = await this.prisma.event.findFirst({
  //   where: { externalId: String(raw.matchId) },
  //   include: { competition: true },
  // });

  // if (!event || !event.competition) {
  //   throw new ForbiddenException('Invalid event access');
  // }

  // const sportId = BETFAIR_SPORT_ID_MAP[event.competition.sport];

  // await this.validateIpService.validateIpAccess(
  //   ip,
  //   event.competition.providerId,
  //   sportId
  // );


    return {
      marketId: raw.marketId,
      marketName: raw.marketName,
      matchId: raw.matchId,
      status: raw.status,
      inplay: raw.inplay,
      runners: (raw.runners || []).map((r: any) => ({
        selectionId: r.selectionId,
        runnerName: r.runnerName,
        back: r.back || [],
        lay: r.lay || [],
      })),
    };
  }

 async getMarketOddsByIds(marketIds: string[], ip: string) {
  const results = [];

  for (const id of marketIds) {
    const raw = await this.getRawMarketData(id);
    if (!raw) continue;

    // //Find event using matchId
    // const event = await this.prisma.event.findFirst({
    //   where: { externalId: String(raw.matchId) },
    //   include: { competition: true },
    // });

    // if (!event || !event.competition) {
    //   continue; // or throw error if strict
    // }

    // //  Get sport and  provider
    // const sport = event.competition.sport;
    // const providerId = event.competition.providerId;

    // const sportId = BETFAIR_SPORT_ID_MAP[sport];

    // // Validate IP access
    // await this.validateIpService.validateIpAccess(
    //   ip,
    //   providerId,
    //   sportId
    // );

    results.push({
      marketId: raw.marketId,
      marketName: raw.marketName,
      matchId: raw.matchId,
      status: raw.status,
      inplay: raw.inplay,
      runners: (raw.runners || []).map((r: any) => ({
        selectionId: r.selectionId,
        runnerName: r.runnerName,
        back: r.back || [],
        lay: r.lay || [],
      })),
    });
  }

  return results;
}

  private async getRawMarketData(marketId: string) {
    const redis = this.redisService.client;
    const normalizedMarketId = String(marketId).trim();

    // Step 1: find all market keys
    const keys = await redis.keys(`marketOdds:*`);

    for (const key of keys) {
      const value = await redis.get(key);
      if (!value) {
        continue;
      }

      try {
        const parsed = JSON.parse(value);
        const data = parsed?.data ?? parsed;

        if (String(data?.marketId).trim() === normalizedMarketId) {
          return data;
        }
      } catch (error) {
        continue;
      }
    }

    return null;
  }

  //  Extract clean marketId (important)
  private extractMarketId(raw: string) {
    return raw.split(':')[0];
  }
}
