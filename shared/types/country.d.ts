// Raw shape returned by restcountries v5 API
interface Country {
  names: {
    common: string;
    official: string;
  };
  codes: {
    alpha_2: string;
    alpha_3: string;
  };
  flag: {
    emoji: string;
    url_svg: string;
    url_png: string;
    description: string;
  };
  capitals: {
    name: string;
    primary: boolean;
    coordinates: { lat: number; lng: number };
  }[];
  region: string;
  subregion: string;
  population: number;
  languages: {
    name: string;
    bcp47: string;
  }[];
  calling_codes: string[]; // already flat e.g. ["1"], no more idd.root + suffixes
}

// Normalized shape used throughout the app UI
interface CountryOption {
  id: string; // codes.alpha_2
  name: string; // names.common
  flag: string; // flag.url_svg
  flagAlt: string; // flag.description
  phoneCode: string; // calling_codes[0] e.g. "+1"
  population: number;
  region: string;
  subregion: string;
  capital: string; // capitals[0].name
  languages: string[]; // languages[].name
}

interface CountriesApiResponse {
  data: {
    objects: Country[];
    meta: {
      total: number;
      count: number;
      limit: number;
      offset: number;
      more: boolean;
    };
  };
}

interface CountriesPageResponse {
  items: CountryOption[];
  total: number;
  hasMore: boolean;
}
