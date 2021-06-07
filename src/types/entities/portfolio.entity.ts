export type PortfolioEntity = {
  accountId: string;
  createdBy: string;
  positions?: PositionInfo[];
  enabled?: boolean;
  deleted?: boolean;
};

export type PositionInfo = {
  ticker: string;
  value: number;
};
