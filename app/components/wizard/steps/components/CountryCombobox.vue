<template>
  <Combobox v-model="model" nullable as="div" v-slot="{ open }">
    <!-- ComboboxOpenStateWatch is just a blank component so that we can track Combobox's open state  -->
    <!-- This was the last resort since headlessui doesn't provide an event for this -->
    <ComboboxOpenStateWatch :open="open" @open="onOpenUpdate" />

    <slot></slot>

    <transition
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <ComboboxOptions
        class="jw-vw-country-combobox-options-dropdown"
        :class="dropdownWidthClass"
      >
        <div class="jw-vw-country-combobox-search">
          <ComboboxInput
            class="jw-vw-country-combobox-search-input"
            placeholder="Search country or code..."
            :displayValue="() => ''"
            @change="emit('search', $event.target.value)"
          />
        </div>

        <div class="jw-vw-country-combobox-options">
          <ComboboxOption
            v-for="country in countries"
            :key="country.id"
            :value="country"
            v-slot="{ selected, active }"
          >
            <li
              class="jw-vw-country-combobox-option"
              :class="active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'"
            >
              <div class="jw-vw-country-combobox-option-content">
                <img
                  :src="country.flag"
                  :alt="country.flagAlt"
                  class="jw-vw-country-combobox-option-flag"
                />
                <span
                  class="jw-vw-country-combobox-option-name"
                  :class="
                    selected ? 'font-semibold text-gray-900' : 'font-normal'
                  "
                  >{{ country.name }}</span
                >
              </div>
              <span class="jw-vw-country-combobox-option-phone-code">
                {{ country.phoneCode }}
              </span>
            </li>
          </ComboboxOption>

          <!-- Intersection Observer Trigger -->
          <div
            v-if="hasMore"
            ref="loadMoreTrigger"
            class="jw-vw-country-combobox-options-load-more"
          ></div>

          <!-- Pending spinner inside the dropdown when lazy-loadeing  -->
          <div v-if="pending" class="jw-vw-country-combobox-options-pending">
            <svg
              class="h-5 w-5 text-primary-400 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>

          <!-- Empty State -->
          <div
            v-if="!pending && countries.length === 0"
            class="jw-vw-country-combobox-options-empty"
          >
            No matches found.
          </div>
        </div>
      </ComboboxOptions>
    </transition>
  </Combobox>
</template>
<script setup lang="ts">
import {
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/vue";
import ComboboxOpenStateWatch from "@/components/wizard/steps/components/ComboboxOpenStateWatch.vue";

const model = defineModel<CountryOption | null>();

const props = defineProps<{
  countries: CountryOption[];
  query: string;
  pending: boolean;
  hasMore: boolean;
  dropdownWidthClass?: string;
}>();

const emit = defineEmits<{
  search: [query: string];
  loadMore: [];
}>();

const onOpenUpdate = (isOpen: boolean) => {
  if (!isOpen) {
    emit("search", "");
  }
};

const loadMoreTrigger = ref<HTMLElement | null>(null);

// Intersection Observer for infinite scrolling
let observer: IntersectionObserver | null = null;
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (
        entries[0]?.isIntersecting &&
        props.countries.length &&
        props.hasMore &&
        !props.pending
      ) {
        emit("loadMore");
      }
    },
    { root: null, rootMargin: "50px", threshold: 0.1 },
  );
});

watch(loadMoreTrigger, (el) => {
  if (el && observer) observer.observe(el);
});
onBeforeUnmount(() => {
  if (observer) observer.disconnect();
});
</script>

<style lang="scss" scoped>
.jw-vw-country-combobox-options-dropdown {
  @apply absolute z-20 mt-2 w-full max-h-[12.5rem] overflow-hidden rounded-xl bg-white p-2 text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm;

  .jw-vw-country-combobox-search {
    @apply sticky top-0 z-50 bg-white pb-2;

    .jw-vw-country-combobox-search-input {
      @apply w-full rounded-lg bg-gray-50 py-2.5 px-3 text-sm text-gray-900 outline-none border border-transparent focus:border-gray-200 placeholder:text-gray-500;
    }
  }

  .jw-vw-country-combobox-options {
    @apply max-h-[7.5rem] overflow-auto relative;

    .jw-vw-country-combobox-option {
      @apply relative cursor-default select-none rounded-lg py-2.5 pl-3 pr-4 transition-colors flex items-center justify-between;

      .jw-vw-country-combobox-option-content {
        @apply flex items-center gap-3 overflow-hidden pr-2;

        .jw-vw-country-combobox-option-flag {
          @apply w-5 h-5 rounded-full object-cover shrink-0 border border-gray-200;
        }

        .jw-vw-country-combobox-option-name {
          @apply block truncate;
        }
      }

      .jw-vw-country-combobox-option-phone-code {
        @apply text-xs text-gray-400 font-mono shrink-0;
      }
    }

    .jw-vw-country-combobox-options-load-more {
      @apply h-4 w-full;
    }

    .jw-vw-country-combobox-options-pending {
      @apply flex items-center justify-center py-4;
    }

    .jw-vw-country-combobox-options-empty {
      @apply py-2 pl-3 text-sm text-gray-500;
    }
  }
}
</style>
