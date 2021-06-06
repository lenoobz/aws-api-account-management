export type PortfolioEntity = {
  id: string;
  positions: PositionInfo;
};

export type PositionInfo = {
  [ticker: string]: number;
};
