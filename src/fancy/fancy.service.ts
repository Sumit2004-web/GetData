import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/redis/redis.service';
import { SessionResponseDto } from './dto/fancy-response.dto';
import { transformFancyMarket } from './utils/transform.utils';

@Injectable()
export class FancyService {
  constructor(private readonly redisService: RedisService) {}

  //  Get all fancy markets by eventId
  async getFancyByEventId(eventId: string): Promise<SessionResponseDto[]> {
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
