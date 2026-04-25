export interface CountryName {
  common: string;
  official: string;
  nativeName?: {
    [key: string]: Omit<CountryName, "nameName">;
  };
}

export interface Country {
  name: CountryName;
  cca2: string;
  flags: {
    alt: string;
    png: string;
    svg: string;
  };
  idd: { root: string; suffixes: string[] };
  population: number;
  continents: string[];
}

export interface CountryOption {
  id: string;
  name: string;
  flag: string;
  phoneCode: string;
  population: number;
  continent: string;
}
