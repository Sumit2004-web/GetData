import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusType } from '@prisma/client';

@Injectable()
export class MarketService {
  constructor(private readonly prisma: PrismaService) {}

  async getMarketsByEvent(eventId: string) {
    const normalizedEventId = String(eventId);

    let markets = await this.prisma.market.findMany({
      where: {
        event: {
          externalId: normalizedEventId,
        },
        status: StatusType.Active,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });



    return markets.map((m) => {
      const runners = this.parseRunners(m.runner);

      return {
        marketId: m.externalId,
        marketName: m.name,
        status: m.status,
        inPlay: true,
        totalMatched: 0,
        runners,
      };
    });
  }

  private parseRunners(runnerJson: any) {
    if (!runnerJson) return [];

    try {
      // If already object
      const runners =
        typeof runnerJson === 'string' ? JSON.parse(runnerJson) : runnerJson;

      return runners.map((r: any) => ({
        selectionId: r.selectionId?.toString() || '',
        runnerName: r.runnerName || r.name || '',
      }));
    } catch (error) {
      return [];
    }
  }
}
