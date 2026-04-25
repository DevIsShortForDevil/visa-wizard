<script setup lang="ts">
import { ComboboxButton } from "@headlessui/vue";
import CountryCombobox from "@/components/wizard/steps/components/CountryCombobox.vue";

const model = defineModel<CountryOption | null>();

defineProps({
  countries: { type: Array as () => CountryOption[], required: true },
  label: { type: String, required: true },
  error: { type: String, default: "" },
  exclude: { type: Object as () => CountryOption | null, default: null },
});
</script>

<template>
  <div class="flex flex-col">
    <label class="text-sm font-medium text-gray-700 mb-2">{{ label }}</label>

    <CountryCombobox
      v-model="model"
      :countries="countries"
      :exclude="exclude"
      class="relative w-full"
    >
      <ComboboxButton
        class="relative w-full cursor-default rounded-xl border bg-white py-3 pl-4 pr-10 text-left outline-none transition-colors"
        :class="
          error
            ? 'border-error-400 ring-1 ring-error-400'
            : 'border-gray-300 hover:border-gray-400 focus:border-gray-500 focus:ring-1 focus:ring-gray-500'
        "
      >
        <div class="flex items-center gap-3 w-full pr-2">
          <img
            v-if="model"
            :src="model.flag"
            class="w-6 h-6 rounded-full object-cover shrink-0 border border-gray-100"
            alt=""
          />
          <span
            class="block truncate"
            :class="model ? 'text-gray-900 font-medium' : 'text-gray-500'"
          >
            {{ model ? model.name : "Select a country..." }}
          </span>
        </div>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400"
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
        </span>
      </ComboboxButton>
    </CountryCombobox>

    <div class="relative">
      <span
        v-if="error"
        class="absolute z-8 text-sm text-error-600 mt-2 transition-all"
      >
        {{ error }}
      </span>
    </div>
  </div>
</template>
