import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatusType } from '@prisma/client';
import { BETFAIR_SPORT_ID_MAP } from 'src/common/constants/sportIdMap';
import { ValidateIpService } from 'src/common/providers/validateIp.service';

@Injectable()
export class MarketService {
  constructor(private readonly prisma: PrismaService,
    private readonly validateIpService:ValidateIpService
  ) {}
  async getMarketsByEvent(eventId: string, ip: string) {
  const normalizedEventId = String(eventId);

  //  Get event 
  const event = await this.prisma.event.findFirst({
    where: {
      externalId: normalizedEventId,
    },
    include: {
      competition: true,
    },
  });

  if (!event) {
    return [];
  }

  if (!event.competition) {
  throw new BadRequestException('Competition not found for event');
  }
  const Sport_Id= BETFAIR_SPORT_ID_MAP[event.competition?.sport]
  if (!Sport_Id) {
  throw new BadRequestException(`Invalid sport: ${event.competition.sport}`);
  }  
  console.log("VALIDATION INPUT:", ip, event.competition.providerId, Sport_Id);
  //  Validate IP access
  await this.validateIpService.validateIpAccess(
    ip,
    event.competition.providerId,
    Sport_Id
  );

  //  Fetch markets
  const markets = await this.prisma.market.findMany({
    where: {
      eventId: event.id,
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
      inPlay: event.status === StatusType.Live,
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
