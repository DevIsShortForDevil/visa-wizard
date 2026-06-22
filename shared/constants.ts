// Country Fetch limit for API calls.
// Max allowed by restcountries v5
// This is intentionally not a prop or config variable
// It's a technical detail that doesn't need to be exposed to the rest of the app.
export const COUNTRY_FETCH_LIMIT = 100;

// Maximum countries per page rendered in dropdowns
// Kept as a constant rather than a prop — this is an intentional UX decision,
// not a configuration concern. See README for reasoning.
export const COUNTRY_PAGE_LIMIT = 20;

// restCountries response fields
export const COUNTRY_RESPONSE_FIELDS = [
  "names.common",
  "names.official",
  "codes.alpha_2",
  "codes.alpha_3",
  "flag.emoji",
  "flag.url_svg",
  "flag.description",
  "capitals",
  "region",
  "subregion",
  "population",
  "languages",
  "calling_codes",
].join(",");
