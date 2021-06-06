export type PortfolioEntity = {
  id?: string;
  createdBy: string;
  positions?: PositionInfo;
};

export type PositionInfo = {
  [ticker: string]: number;
};
