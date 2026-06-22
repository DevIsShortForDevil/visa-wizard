<template>
  <div class="jw-vw-country-select">
    <label class="jw-vw-country-select-label">{{ label }}</label>

    <CountryCombobox
      v-model="model"
      :countries="countries"
      :pending="pending"
      :has-more="hasMore"
      :query="query"
      :dropdown-width-class="dropdownWidthClass"
      class="relative w-full"
      @search="searchCountries"
      @load-more="loadMore"
    >
      <ComboboxButton
        class="jw-vw-country-select-combobox-button"
        :class="
          error
            ? 'jw-vw-country-select-combobox-button__error'
            : 'jw-vw-country-select-combobox-button__primary'
        "
      >
        <div class="jw-vw-country-select-combobox-button-content">
          <img
            v-if="model"
            :src="model.flag"
            :alt="model.flagAlt"
            class="jw-vw-country-select-combobox-button-flag"
          />
          <span
            class="jw-vw-country-select-combobox-button-text"
            :class="model ? 'text-gray-900 font-medium' : 'text-gray-500'"
          >
            {{ model ? model.name : "Select a country..." }}
          </span>
        </div>
        <!-- Search / spinner icon with transition -->
        <span class="jw-vw-country-select-combobox-button-icon">
          <transition
            mode="out-in"
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-75"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-75"
          >
            <!-- Spinner -->
            <svg
              v-if="pending"
              key="spinner"
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

            <!-- Search icon -->
            <svg
              v-else
              key="search"
              class="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </transition>
        </span>
      </ComboboxButton>
    </CountryCombobox>

    <div class="relative h-5">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <span v-if="error" class="jw-vw-country-select-error">
          {{ error }}
        </span>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComboboxButton } from "@headlessui/vue";
import CountryCombobox from "@/components/wizard/steps/components/CountryCombobox.vue";

const model = defineModel<CountryOption | null>();

const props = defineProps<{
  label: string;
  error?: string;
  exclude?: CountryOption | null;
  dropdownWidthClass?: string;
}>();

// exclude must be a ref for the composable's computed filter to stay reactive
const excludeRef = computed(() => props.exclude ?? null);

const {
  countries,
  query,
  pending,
  hasMore,
  lazyLoad,
  loadMore,
  searchCountries,
} = useCountrySelect(excludeRef, { lazy: true });

onMounted(() => lazyLoad());
</script>

<style lang="scss" scoped>
.jw-vw-country-select {
  @apply flex flex-col;

  .jw-vw-country-select-label {
    @apply text-sm font-medium text-gray-700 mb-2;
  }

  .jw-vw-country-select-error {
    @apply absolute z-10 text-sm text-error-600 mt-2;
  }

  .jw-vw-country-select-combobox-button {
    @apply relative w-full cursor-default rounded-xl border bg-white py-3 pl-4 pr-10 text-left outline-none transition-colors;

    &.__error {
      @apply border-error-400 ring-1 ring-error-400;
    }
    &.__primary {
      @apply border-gray-300 hover:border-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500;
    }

    .jw-vw-country-select-combobox-button-content {
      @apply flex items-center gap-3 w-full pr-2;

      .jw-vw-country-select-combobox-button-flag {
        @apply w-6 h-6 rounded-full object-cover shrink-0 border border-gray-100;
      }
      .jw-vw-country-select-combobox-button-text {
        @apply block truncate;
      }
    }

    .jw-vw-country-select-combobox-button-icon {
      @apply pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3;
    }
  }
}
</style>
