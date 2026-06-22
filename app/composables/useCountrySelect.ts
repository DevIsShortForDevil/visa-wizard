import type { Ref } from "vue";
import { COUNTRY_PAGE_LIMIT } from "#shared/constants";

export function useCountrySelect(
  exclude?: Ref<CountryOption | null>,
  options: { lazy?: boolean } = {},
) {
  const offset = ref(0);
  const search = ref("");
  const countries = ref<CountryOption[]>([]);
  const total = ref(0);
  const hasMore = ref(false);
  const error = ref<Error | null>(null);

  // this key is required to prevent the two dropdowns in GeographyStep from duplicating.
  // I do not like using instance keys like this, but the alternative here is not better.
  const instanceKey = Math.random().toString(36).slice(2, 7);

  const query = computed(() => ({
    limit: COUNTRY_PAGE_LIMIT,
    offset: offset.value,
    ...(search.value ? { q: search.value } : {}),
  }));

  const { lazy = false } = options; // eager by default

  const lazyLoaded = ref(false);
  const lazyLoad = () => {
    if (lazyLoaded.value) return;
    lazyLoaded.value = true;
    execute();
  };

  const { status, execute } = useFetch<CountriesPageResponse>(
    "/api/countries",
    {
      key: `countries-${instanceKey}`,
      query,
      immediate: !lazy,
      watch: false, // manual execution only
      getCachedData: () => undefined, // disable client-side cache entirely
      onResponse({ response }) {
        const incoming = response._data;
        if (!incoming) return;
        if (offset.value === 0) {
          // Fresh search or reset — replace list
          countries.value = incoming.items;
        } else {
          // Pagination — append to existing list
          countries.value.push(...incoming.items); // mutate instead of replace
        }
        total.value = incoming.total;
        hasMore.value = incoming.hasMore;
      },
      onResponseError({ error: err }) {
        error.value = err ?? null;
      },
    },
  );

  const pending = computed(() => status.value === "pending");

  // Filtered view — reactively excludes the sibling dropdown's selection
  const filteredCountries = computed(() =>
    exclude?.value
      ? countries.value.filter((c) => c.id !== exclude.value!.id)
      : countries.value,
  );

  // Load next page — triggered by intersection observer in the dropdown component
  const loadMore = () => {
    if (!hasMore.value || pending.value) return;
    offset.value += COUNTRY_PAGE_LIMIT;
    execute();
  };

  // Each composable call creates its own debounce closure — independent timers
  const debouncedExecute = debounce(() => execute(), 300);

  const searchCountries = (q: string) => {
    search.value = q;
    offset.value = 0;
    countries.value = []; // clear immediately to avoid stale flash
    debouncedExecute();
  };

  const reset = () => {
    search.value = "";
    offset.value = 0;
    countries.value = [];
    execute();
  };

  return {
    countries: filteredCountries,
    query: readonly(search),
    total,
    hasMore,
    pending,
    error,
    loadMore,
    searchCountries,
    reset,
    lazyLoad,
  };
}
