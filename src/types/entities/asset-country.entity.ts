export type AssetCountryEntity = {
  ticker: string;
  assetClass?: string;
  countries?: CountryDetails[];
};

export type CountryDetails = {
  countryCode?: string;
  countryName?: string;
  holdingStatCode?: string;
  fundMktPercent?: number;
  FundTnaPercent?: number;
};
