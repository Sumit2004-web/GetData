import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MarketOddsService {
  constructor(private readonly redisService: RedisService) {}

  async getMarketOdds(matchId: string) {
    const redis = this.redisService.client;
    const matchIdStr = String(matchId);

    // Step 1: try to find relevant keys in Redis (new and old patterns)
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

  async getMarketById(marketId: string) {
    const raw = await this.getRawMarketData(marketId);
    if (!raw) {
      throw new Error('Market not found');
    }

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

  async getMarketOddsByIds(marketIds: string[]) {
    const results = [];
    for (const id of marketIds) {
      const raw = await this.getRawMarketData(id);
      if (!raw) continue;
      results.push(raw);
    }
    return results;
  }

  private async getRawMarketData(marketId: string) {
    const redis = this.redisService.client;

    // Step 1: find all market keys
    const keys = await redis.keys(`marketOdds:*`);

    let matchedKey: string | null = null;

    for (const key of keys) {
      // Extract last part of key
      const parts = key.split(':');

      // MarketId starts after matchId → join remaining
      const extractedMarketId = parts.slice(5).join(':');

      if (extractedMarketId === marketId) {
        matchedKey = key;
        break;
      }
    }

    if (!matchedKey) {
      return null;
    }

    const value = await redis.get(matchedKey);
    if (!value) {
      return null;
    }

    const parsed = JSON.parse(value);
    return parsed?.data ?? parsed;
  }

  //  Extract clean marketId (important)
  private extractMarketId(raw: string) {
    return raw.split(':')[0];
  }
}
