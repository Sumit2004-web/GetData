import {  ForbiddenException, Injectable } from '@nestjs/common';
import { SportType, StatusType } from '@prisma/client';
import { BETFAIR_SPORT_ID_MAP } from 'src/common/constants/sportIdMap';
import { ValidateIpService } from 'src/common/providers/validateIp.service';
import { PrismaService } from 'src/prisma';

@Injectable()
export class CompetitionService {
  constructor(private readonly prisma: PrismaService,
    private readonly validateIpService:ValidateIpService
  ) {}
  async getCompetitionsBySportDefaultProvider(sportId: number, ip: string) {
    const sportName = Object.keys(BETFAIR_SPORT_ID_MAP).find(
      (key) => BETFAIR_SPORT_ID_MAP[key] == sportId,
    );
    const defaultConfig = await this.prisma.providerConfig.findFirst({
      include: { defaultProvider: true },
    });

    if (!defaultConfig?.defaultProvider) {
      throw new Error('Default provider not set');
    }

    // Validate IP access before returning data
    await this.validateIpService.validateIpAccess(ip, defaultConfig.defaultProvider.id, sportId);

    console.log('sportName', sportName);
    const competitions = await this.prisma.competition.findMany({
      where: {
        sport: sportName as SportType,
        providerId: defaultConfig.defaultProvider.id,
        status: StatusType.Active,
      },
      orderBy: { createdAt: 'desc' },
    });

    return competitions.map((c) => ({
      sportName: c.sport,
      sportId: sportId.toString(),
      competitionName: c.name,
      competitionId: c.externalId,
      competitionRegion: '',
      marketCount: c.marketCount || 0,
    }));
  }
}
