<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import Fuse from "fuse.js";
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";

const model = defineModel<CountryOption | null>();

const props = defineProps({
  countries: { type: Array as () => CountryOption[], required: true },
  exclude: { type: Object as () => CountryOption | null, default: null },
  // Allows the parent to override the dropdown width (essential for the phone input)
  dropdownWidthClass: { type: String, default: "w-[var(--button-width)]" },
});

const query = ref("");
const renderLimit = ref(20);
const loadMoreTrigger = ref<HTMLElement | null>(null);

// --- Shared Logic ---
const fuse = computed(
  () =>
    new Fuse(props.countries, {
      keys: ["name", "phoneCode"],
      threshold: 0.3,
      ignoreLocation: true,
    }),
);

const filteredCountries = computed(() => {
  if (query.value.trim() === "") return props.countries;
  return fuse.value.search(query.value).map((result) => result.item);
});

const displayedCountries = computed(() =>
  props.exclude
    ? filteredCountries.value
        .filter((c) => c.name !== props.exclude?.name)
        .slice(0, renderLimit.value) // filter out the excluded country if provided
    : filteredCountries.value.slice(0, renderLimit.value),
);

watch(query, () => {
  renderLimit.value = 20;
});

let observer: IntersectionObserver | null = null;
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0]?.isIntersecting &&
        renderLimit.value < filteredCountries.value.length
      ) {
        renderLimit.value += 20;
      }
    },
    { root: null, rootMargin: "50px", threshold: 0.1 },
  );
});

watch(loadMoreTrigger, (newEl) => {
  if (newEl && observer) observer.observe(newEl);
});
onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<template>
  <Combobox v-model="model" nullable as="div">
    <slot></slot>

    <transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
      @after-leave="query = ''"
    >
      <ComboboxOptions
        class="absolute z-10 mt-2 w-full max-h-[12.5rem] overflow-hidden rounded-xl bg-white p-2 text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm"
        :class="dropdownWidthClass"
      >
        <div class="sticky top-0 z-20 bg-white pb-2">
          <ComboboxInput
            class="w-full rounded-lg bg-gray-50 py-2.5 px-3 text-sm text-gray-900 outline-none border border-transparent focus:border-gray-200 placeholder:text-gray-500"
            placeholder="Search country or code..."
            @change="query = $event.target.value"
            :displayValue="() => ''"
          />
        </div>

        <div class="max-h-[7.5rem] overflow-auto relative">
          <ComboboxOption
            v-for="country in displayedCountries"
            :key="country.id"
            :value="country"
            v-slot="{ selected, active }"
          >
            <li
              class="relative cursor-default select-none rounded-lg py-2.5 pl-3 pr-4 transition-colors flex items-center justify-between"
              :class="active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'"
            >
              <div class="flex items-center gap-3 overflow-hidden pr-2">
                <img
                  :src="country.flag"
                  class="w-5 h-5 rounded-full object-cover shrink-0 border border-gray-200"
                  alt=""
                />
                <span
                  class="block truncate"
                  :class="
                    selected ? 'font-semibold text-gray-900' : 'font-normal'
                  "
                  >{{ country.name }}</span
                >
              </div>
              <span class="text-xs text-gray-400 font-mono shrink-0">{{
                country.phoneCode
              }}</span>
            </li>
          </ComboboxOption>

          <div
            v-if="displayedCountries.length < filteredCountries.length"
            ref="loadMoreTrigger"
            class="h-4 w-full"
          ></div>
          <div
            v-if="filteredCountries.length === 0 && query !== ''"
            class="py-2 pl-3 text-sm text-gray-500"
          >
            No matches found.
          </div>
        </div>
      </ComboboxOptions>
    </transition>
  </Combobox>
</template>
