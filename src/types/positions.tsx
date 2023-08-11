import { Token } from "./common";

export enum PositionStatus {
  active = 'ACTIVE',
  completed = 'COMPLETED',
}

export interface PositionSwap {
  swapped: bigint,
  timestamp: string,
  rate: bigint,
}

export interface UIPosition {
  from: Token,
  to: Token,
  user: string,
  swapInterval: bigint,
  rate: bigint,
  rateUsd: number,
  remainingLiquidity: bigint,
  remainingLiquidityUsd: number,
  toWithdraw: bigint,
  toWithdrawUsd: number,
  remainingSwaps: number,
  totalSwaps: number,
  id: string,
  status: PositionStatus,
  swaps: PositionSwap[],
}
