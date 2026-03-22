import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class BookmakerOddsService {
  private readonly logger = new Logger(BookmakerOddsService.name);

  constructor(private readonly redisService: RedisService) {}

  async getOddsByMarketId(marketId: string) {
    const response = await this.getOddsForMarketIds([marketId]);
    return response.data.length ? response.data[0] : null;
  }

  async getOddsForMarketIds(marketIds: string[]) {
    const redis = this.redisService.client;

    const normalizedIds = marketIds
      .map((id) => String(id || '').trim())
      .filter(Boolean);

    const data = [];

    for (const id of normalizedIds) {
      const value = await this.loadFromRedis(redis, id);
      if (!value) continue;

      data.push(value);
    }

    return {
      marketName: 'Bookmaker',
      eventID: data.length ? (data[0].EventID ?? '') : '',
      data,
    };
  }

  private async loadFromRedis(redis: any, marketId: string) {
    const raw = await redis.get(`BookmakerOdds:${marketId}`);

    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);

      // If the stored payload wraps data inside `data`, unwrap it.
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
