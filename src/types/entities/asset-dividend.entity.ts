export type AssetDividendEntity = {
  ticker: string;
  dividends?: { [timestamp: number]: DividendDetails[] };
};

export type DividendDetails = {
  distDesc?: string;
  distCode?: string;
  amount?: number;
  exDividendDate?: Date;
  recordDate?: Date;
  payableDate?: Date;
};
