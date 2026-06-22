<template>
  <div class="jw-vw-phone-input">
    <label class="jw-vw-phone-input-label">{{ label }}</label>

    <div
      class="jw-vw-phone-input-field relative"
      :class="
        error
          ? 'jw-vw-phone-input-field__error'
          : 'jw-vw-phone-input-field__primary'
      "
    >
      <CountryCombobox
        v-model="countryModel"
        :countries="countries"
        :pending="pending"
        :has-more="hasMore"
        :query="query"
        dropdownWidthClass="w-full left-0"
        class="shrink-0"
        @search="searchCountries"
        @load-more="loadMore"
      >
        <ComboboxButton class="jw-vw-phone-input-field-combobox-button">
          <template v-if="countryModel">
            <img
              :src="countryModel.flag"
              :alt="countryModel.flagAlt"
              class="jw-vw-phone-input-field-combobox-flag"
            />
            <span class="jw-vw-phone-input-field-combobox-text">
              {{ countryModel.phoneCode }}
            </span>
          </template>
          <template v-else>
            <span class="jw-vw-phone-input-field-combobox-empty-text">
              Code
            </span>
          </template>
        </ComboboxButton>
      </CountryCombobox>

      <!-- divider -->
      <div class="jw-vw-phone-input-field-divider"></div>

      <!-- phone number input -->
      <input
        v-model="numberModel"
        type="tel"
        placeholder="Phone number"
        class="jw-vw-phone-input-field-number-input"
      />
    </div>

    <div class="relative h-5">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <span v-if="error" class="jw-vw-phone-input-error">
          {{ error }}
        </span>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ComboboxButton } from "@headlessui/vue";
import CountryCombobox from "@/components/wizard/steps/components/CountryCombobox.vue";

defineProps<{
  label: string;
  error?: string;
}>();

const countryModel = defineModel<CountryOption | null>("country");
const numberModel = defineModel<string>("number");

// PhoneInput is lazy — no fetch until user opens the dropdown
const {
  countries,
  query,
  pending,
  hasMore,
  loadMore,
  searchCountries,
  lazyLoad,
} = useCountrySelect(ref(null), { lazy: true });

onMounted(() => lazyLoad());
</script>

<style lang="scss" scoped>
.jw-vw-phone-input {
  @apply flex flex-col;

  .jw-vw-phone-input-label {
    @apply text-gray-700 mb-2;
  }

  .jw-vw-phone-input-field {
    @apply relative flex items-center rounded-xl border bg-white outline-none transition-colors focus-within:ring-1;

    &.__error {
      @apply border-error-400 focus-within:ring-error-400 focus-within:border-error-400;
    }
    &.__primary {
      @apply border-gray-300 hover:border-gray-400 focus-within:border-primary-600 focus-within:ring-primary-600;
    }

    .jw-vw-phone-input-field-combobox-button {
      @apply flex items-center gap-2 py-3 pl-4 pr-3 outline-none rounded-l-xl hover:bg-gray-50 h-full;

      .jw-vw-phone-input-field-combobox-flag {
        @apply w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0;
      }
      .jw-vw-phone-input-field-combobox-text {
        @apply text-gray-900 text-body-m-bold;
      }
      .jw-vw-phone-input-field-combobox-empty-text {
        @apply text-gray-500 text-body-m;
      }
    }

    .jw-vw-phone-input-field-divider {
      @apply w-px h-6 bg-gray-300;
    }

    .jw-vw-phone-input-field-number-input {
      @apply flex-1 py-3 px-3 bg-transparent border-none focus:ring-0 text-body-m text-gray-900 outline-none placeholder:text-gray-400 rounded-r-xl;
    }
  }

  .jw-vw-phone-input-error {
    @apply absolute z-10 text-sm text-error-600 mt-2;
  }
}
</style>
