export type PositionEntity = {
  accountId: string;
  createdBy: string;
  ticker: string;
  shares?: number;
  enabled?: boolean;
  deleted?: boolean;
};
