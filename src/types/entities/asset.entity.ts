export type AssetEntity = {
  ticker: string;
  name: string;
};

export type AssetDetailsEntity = {
  ticker: string;
  name: string;
  type?: string;
  assetClass?: string;
  currency?: string;
  allocationStock?: number;
  allocationBond?: number;
  allocationCash?: number;
  dividendSchedule?: string;
  yield12Month?: number;
  distYield?: number;
  distAmount?: number;
};
