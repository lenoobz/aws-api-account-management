export type AssetSectorEntity = {
  ticker: string;
  assetClass?: string;
  sectors?: SectorDetails[];
};

export type SectorDetails = {
  sectorCode?: string;
  sectorName?: string;
  fundPercent?: number;
};
