// Server route for country data.
// Uses a two-layer caching strategy:
// 1. defineCachedFunction caches full batches of 100 from restcountries by search term
// 2. defineEventHandler slices cached batches for pagination — never cached itself
// Fuzzy search fallback uses all available cached batches via Nitro storage,
// with a singleton Fuse instance rebuilt hourly matching the cache TTL.
// The fuzzy search implementation is more of a proof of concept.
// The configuration is correct but it might not find every combination.
// As setting it too loose will just return unrelated options too.

import Fuse from "fuse.js";

import {
  COUNTRY_FETCH_LIMIT,
  COUNTRY_PAGE_LIMIT,
  COUNTRY_RESPONSE_FIELDS,
} from "#shared/constants";

// Normalize raw API shape into the leaner CountryOption used by the UI
const normalizeCountry = (c: Country): CountryOption => {
  return {
    id: c.codes.alpha_2,
    name: c.names.common,
    flag: c.flag.url_svg,
    flagAlt: c.flag.description,
    phoneCode: c.calling_codes[0] ? `+${c.calling_codes[0]}` : "",
    population: c.population,
    region: c.region,
    subregion: c.subregion,
    capital: c.capitals?.[0]?.name ?? "",
    languages: c.languages?.map((l) => l.name) ?? [],
  };
};

// --- Fuse.js singleton ---
// Persists across requests in Node.js module scope.
// Note: on Vercel serverless, this resets on cold starts — see README.
let fuseInstance: Fuse<CountryOption> | null = null;
let fuseLastBuilt = 0;
const FUSE_TTL = 60 * 60 * 1000; // 1 hour — matches cache maxAge

const getFuseInstance = (items: CountryOption[]): Fuse<CountryOption> => {
  const now = Date.now();
  if (!fuseInstance || now - fuseLastBuilt > FUSE_TTL) {
    fuseInstance = new Fuse(items, {
      keys: ["name"],
      threshold: 0.5,
      ignoreLocation: true,
      minMatchCharLength: 3,
      distance: 200,
    });
    fuseLastBuilt = now;
  }
  return fuseInstance;
};

// using defineCachedFunction to cache the response for 1 hour.
// country data is static, so caching it increases performance and reduces the number of API calls to the external service.
// Since RestCountries has changed and we only get 500 calls a month, this is almost mandatory.

const fetchCountriesBatch = defineCachedFunction(
  async (
    batchOffset: number,
    search?: string,
  ): Promise<Paginated<CountryOption>> => {
    const config = useRuntimeConfig();

    const response = await $fetch<CountriesApiResponse>(config.baseUrl, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
      query: {
        limit: COUNTRY_FETCH_LIMIT,
        offset: batchOffset,
        ...(search ? { q: search } : {}),
        response_fields: COUNTRY_RESPONSE_FIELDS,
      },
    });
    return {
      items: response.data.objects
        .map(normalizeCountry)
        .sort((a, b) => a.name.localeCompare(b.name)),
      total: response.data.meta.total,
      more: response.data.meta.more,
    };
  },
  {
    maxAge: 60 * 60,
    getKey: (batchOffset: number, search?: string) =>
      `countries-${search ?? "all"}-batch-${batchOffset}`,
  },
);

// --- Fuzzy search fallback ---
// Collects all cached unfiltered batches from Nitro storage and runs
// Fuse.js across them. No additional restcountries API calls are made —
// only uses whatever is already in cache at that moment.
const fuzzySearch = async (query: string): Promise<CountryOption[]> => {
  const storage = useStorage("cache");
  const allKeys = await storage.getKeys("nitro:functions:fetchCountriesBatch");

  // Only use unfiltered (all-countries) batches to avoid mixing search contexts
  const unFilteredKeys = allKeys.filter((key) => key.includes("-all-batch-"));

  if (unFilteredKeys.length === 0) return [];

  const batches = await Promise.all(
    unFilteredKeys.map((key) =>
      storage.getItem<{ value: Paginated<CountryOption> }>(key),
    ),
  );

  const allItems = batches.flatMap((b) => b?.value?.items ?? []);

  if (allItems.length === 0) return [];

  const fuse = getFuseInstance(allItems);
  return fuse.search(query).map((r) => r.item);
};

// defineEventHandler handling the inital call
// The max limit on our free plan is 100 and we only get 500 calls a month.
// So we're separating the limit between the client and server side to minimize the number of call to restCountries API.
// each time we'll call restCountries API, we'll cache 100 records for 1 hour
// but only pass 20 to the client to maximize the performance by rendering only 20 options at a time.
// subsequent calls will calculate the offset and return the cached records back from server or call restCountries API only when needed.

export default defineEventHandler(
  async (event): Promise<CountriesPageResponse> => {
    const query = getQuery(event);
    const clientLimit = Number(query.limit) || COUNTRY_PAGE_LIMIT;
    const clientOffset = Number(query.offset) || 0;
    const search = query.q as string | undefined;

    const batchIndex = Math.floor(clientOffset / COUNTRY_FETCH_LIMIT);
    const batchOffset = batchIndex * COUNTRY_FETCH_LIMIT;
    const localOffset = clientOffset - batchOffset;

    const { items, total, more } = await fetchCountriesBatch(
      batchOffset,
      search,
    );
    const slicedItems = items.slice(localOffset, localOffset + clientLimit);

    // Edge case: requested slice spans two batches
    // e.g. clientLimit=20, localOffset=90 → needs items 90-99 from batch 0
    // and items 0-9 from batch 1
    const remainingNeeded = clientLimit - slicedItems.length;

    if (remainingNeeded > 0 && more) {
      const { items: nextBatch } = await fetchCountriesBatch(
        batchOffset + COUNTRY_FETCH_LIMIT,
        search,
      );
      slicedItems.push(...nextBatch.slice(0, remainingNeeded));
    }

    // Fuzzy fallback — only when server search returns no results
    if (slicedItems.length === 0 && search) {
      const fuzzyResults = await fuzzySearch(search);
      if (fuzzyResults.length > 0) {
        return {
          items: fuzzyResults.slice(clientOffset, clientOffset + clientLimit),
          total: fuzzyResults.length,
          hasMore: clientOffset + clientLimit < fuzzyResults.length,
        };
      }
    }

    return {
      items: slicedItems,
      total,
      hasMore: clientOffset + clientLimit < total, // using this instead of "more", since we might still have items to return in cache while "more" is false.
    };
  },
);
