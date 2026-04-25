<script setup lang="ts">
import { ComboboxButton } from "@headlessui/vue";
import CountryCombobox from "@/components/wizard/steps/components/CountryCombobox.vue";

const props = defineProps({
  countries: { type: Array as () => CountryOption[], required: true },
  label: { type: String, required: true },
  error: { type: String, default: "" },
});

const countryModel = defineModel("country", {
  type: Object as () => CountryOption | null,
});
const numberModel = defineModel("number", { type: String });
</script>

<template>
  <div class="flex flex-col">
    <label class="text-input-label text-gray-700 mb-2">{{ label }}</label>

    <div
      class="relative flex items-center rounded-xl border bg-white outline-none transition-colors focus-within:ring-1"
      :class="
        error
          ? 'border-error-400 focus-within:ring-error-400 focus-within:border-error-400'
          : 'border-gray-300 hover:border-gray-400 focus-within:border-primary-600 focus-within:ring-primary-600'
      "
    >
      <CountryCombobox
        v-model="countryModel"
        :countries="countries"
        dropdownWidthClass="w-full left-0"
        class="shrink-0"
      >
        <ComboboxButton
          class="flex items-center gap-2 py-3 pl-4 pr-3 outline-none rounded-l-xl hover:bg-gray-50 h-full"
        >
          <template v-if="countryModel">
            <img
              :src="countryModel.flag"
              class="w-6 h-6 rounded-full object-cover border border-gray-200 shrink-0"
              alt=""
            />
            <span class="text-gray-900 text-body-m-bold">{{
              countryModel.phoneCode
            }}</span>
          </template>
          <template v-else>
            <span class="text-gray-500 text-body-m">Code</span>
          </template>
        </ComboboxButton>
      </CountryCombobox>

      <div class="w-px h-6 bg-gray-300"></div>

      <input
        v-model="numberModel"
        type="tel"
        placeholder="Phone number"
        class="flex-1 py-3 px-3 bg-transparent border-none focus:ring-0 text-body-m text-gray-900 outline-none placeholder:text-gray-400 rounded-r-xl"
      />
    </div>

    <div class="relative">
      <span
        v-if="error"
        class="absolute z-8 text-body-s text-error-600 mt-2 transition-all"
      >
        {{ error }}
      </span>
    </div>
  </div>
</template>
