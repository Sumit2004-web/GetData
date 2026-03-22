import { BadRequestException, Injectable } from '@nestjs/common';
import { Competition, Event, SportType, StatusType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BETFAIR_SPORT_ID_MAP } from '../common/constants/sportIdMap';

@Injectable()
export class EventService {
  constructor(private readonly prisma: PrismaService) {}

  async getEventsByCompetition(externalCompetitionId: string) {
    const competition = await this.findCompetitionByExternalIdWithEvents(
      externalCompetitionId,
    );

    if (!competition || !competition.events?.length) {
      return [];
    }

    return competition.events.map((e) => ({
      event: {
        id: e.externalId,
        name: e.name,
        countryCode: 'IN',
        timezone: 'GMT',
        openDate: e.startTime.toISOString(),
      },
      marketCount: Number(e._count?.markets ?? 0),
      scoreboard_id: '',
      selections: null,
      liability_type: '0',
      undeclared_markets: 1,
    }));
  }

  async getEventsWithCompetitions(competitionId: string) {
    const competition =
      await this.findCompetitionByExternalIdWithEvents(competitionId);

    if (!competition) {
      return [];
    }

    return this.mapCompetitionWithEvents({
      ...competition,
      events: competition.events ?? [],
    });
  }

  async getAllEvents(sportId: string) {
    const parsedSportId = Number(sportId);
    if (Number.isNaN(parsedSportId)) {
      throw new BadRequestException('Invalid sportId');
    }

    const sportName = Object.keys(BETFAIR_SPORT_ID_MAP).find(
      (key) => BETFAIR_SPORT_ID_MAP[key] === parsedSportId,
    ) as SportType | undefined;

    if (!sportName) {
      throw new BadRequestException(`Unsupported sportId: ${sportId}`);
    }

    const defaultConfig = await this.prisma.providerConfig.findFirst({
      include: { defaultProvider: true },
    });

    if (!defaultConfig?.defaultProvider) {
      throw new BadRequestException('Default provider not set');
    }

    const competitions = await this.prisma.competition.findMany({
      where: {
        sport: sportName,
        providerId: defaultConfig.defaultProvider.id,
        status: StatusType.Active,
      },
      include: {
        events: {
          orderBy: {
            startTime: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return competitions.map((competition) =>
      this.mapCompetitionWithEvents(competition),
    );
  }

  private mapCompetitionWithEvents(
    competition: Competition & { events: Event[] },
  ) {
    return {
      competition: {
        id: competition.externalId,
        name: competition.name,
      },
      competitionRegion: '',
      marketCount: competition.marketCount?.toString() ?? '',
      match: competition.events.map((event) => {
        const parsedEventId = Number(event.externalId);
        const eventId = Number.isNaN(parsedEventId)
          ? event.externalId
          : parsedEventId;

        return {
          event: {
            id: eventId,
            name: event.name,
            timezone: 'GMT',
            openDate: event.startTime.toISOString(),
          },
          marketCount: '',
          matchId: eventId,
          gameId: competition.providerId,
          name: event.name,
          seriesId: competition.providerId,
          active: event.status === StatusType.Active,
        };
      }),
    };
  }

  private async findCompetitionByExternalIdWithEvents(externalId: string) {
    const competitions = await this.prisma.competition.findMany({
      where: {
        externalId,
      },
      include: {
        events: {
          orderBy: {
            startTime: 'asc',
          },
          include: {
            _count: {
              select: {
                markets: true,
              },
            },
          },
        },
        _count: {
          select: {
            events: true,
          },
        },
      },
      orderBy: [{ providerId: 'asc' }, { createdAt: 'asc' }],
    });

    if (!competitions.length) {
      return null;
    }

    return (
      competitions.find((competition) => competition._count.events > 0) ??
      competitions[0]
    );
  }
}
