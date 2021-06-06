export type PortfolioEntity = {
  id?: string;
  accountId: string;
  createdBy: string;
  positions: PositionInfo;
};

export type PositionInfo = {
  [ticker: string]: number;
};
