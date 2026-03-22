import { SessionResponseDto } from '../dto/fancy-response.dto';

export function transformFancyMarket(data: any): SessionResponseDto {
  return {
    marketId: data.marketId,
    selectionId: data.SelectionId,
    runnerName: data.RunnerName?.trim(),
    type: data.gtype,
    isBallSession: data.ballsess === '1',

    back: [
      { price: +data.BackPrice1, size: +data.BackSize1 },
      { price: +data.BackPrice2, size: +data.BackSize2 },
      { price: +data.BackPrice3, size: +data.BackSize3 },
    ],

    lay: [
      { price: +data.LayPrice1, size: +data.LaySize1 },
      { price: +data.LayPrice2, size: +data.LaySize2 },
      { price: +data.LayPrice3, size: +data.LaySize3 },
    ],

    limits: {
      min: +data.min,
      max: +data.max,
    },

    status: {
      gameStatus: data.GameStatus || '',
      gtStatus: data.gtstatus || '',
    },

    meta: {
      serialNo: +data.srno,
      priority: +data.sortPriority,
      marketName: data.mname,
      updatedAt: new Date(+data.timestamp).toISOString(),
      timestamp: +data.timestamp,
    },
  };
}
