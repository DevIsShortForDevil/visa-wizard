<script setup lang="ts">
import { computed } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const model = defineModel<Date | null>();

defineProps({
  label: { type: String, required: true },
  error: { type: String, default: "" },
});

// 1. We strictly format the date ourselves.
// It is now mathematically impossible for time to appear in the input!
const formattedDate = computed(() => {
  if (!model.value) return "";
  const date = new Date(model.value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
});
</script>

<template>
  <div class="flex flex-col">
    <label class="text-input-label text-gray-700 mb-2">{{ label }}</label>

    <VueDatePicker v-model="model" :enable-time-picker="false" auto-apply>
      <template #trigger>
        <div class="relative flex items-center cursor-pointer">
          <input
            type="text"
            readonly
            :value="formattedDate"
            placeholder="mm/dd/yyyy"
            class="w-full rounded-xl border bg-white py-3 pl-4 pr-11 text-body-m text-gray-900 outline-none transition-colors placeholder:text-gray-400 cursor-pointer"
            :class="
              error
                ? 'border-error-400 focus:ring-1 focus:ring-error-400'
                : 'border-gray-300 hover:border-gray-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600'
            "
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-900 absolute right-4 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="1.5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </template>
    </VueDatePicker>

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

<style>
/* Look how much cleaner this is! 
  We only need to style the popup menu now, the input is handled entirely by Tailwind.
*/
.dp__theme_light {
  --dp-font-family: inherit;
  --dp-primary-color: #4f00d0; /* primary-600 */
  --dp-border-radius: 0.75rem;
}
</style>
