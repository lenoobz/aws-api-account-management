export type PortfolioEntity = {
  accountId: string;
  createdBy: string;
  positions: PositionInfo[];
};

export type PositionInfo = {
  ticker: string;
  value: number;
};
