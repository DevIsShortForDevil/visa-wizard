<template>
  <div class="jw-vw-date-picker">
    <label class="jw-vw-date-picker-label">{{ label }}</label>

    <VueDatePicker
      v-model="model"
      :time-config="{ enableTimePicker: false }"
      auto-apply
    >
      <template #trigger>
        <div class="jw-vw-date-picker-trigger">
          <input
            type="text"
            readonly
            :value="formattedDate"
            placeholder="mm/dd/yyyy"
            class="jw-vw-date-picker-trigger-input"
            :class="
              error
                ? 'jw-vw-date-picker-trigger-input__error'
                : 'jw-vw-date-picker-trigger-input__primary'
            "
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="jw-vw-date-picker-trigger-icon"
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

    <div class="relative h-5">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <span v-if="error" class="jw-vw-date-picker-error">
          {{ error }}
        </span>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { VueDatePicker } from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

const model = defineModel<Date | null>();

const props = defineProps<{
  label: string;
  error?: string;
}>();

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

<style lang="scss" scoped>
.jw-vw-date-picker {
  @apply flex flex-col;

  .jw-vw-date-picker-label {
    @apply text-input-label text-gray-700 mb-2;
  }

  .jw-vw-date-picker-trigger {
    @apply relative flex items-center cursor-pointer;

    .jw-vw-date-picker-trigger-input {
      @apply w-full rounded-xl border bg-white py-3 pl-4 pr-11 text-body-m text-gray-900 outline-none transition-colors placeholder:text-gray-400 cursor-pointer;

      &.__error {
        @apply border-error-400 focus:ring-1 focus:ring-error-400;
      }

      &.__primary {
        @aapply border-gray-300 hover:border-gray-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600;
      }
    }

    .jw-vw-date-picker-trigger-icon {
      @apply h-5 w-5 text-gray-900 absolute right-4 pointer-events-none;
    }
  }

  .jw-vw-date-picker-error {
    @apply absolute z-10 text-body-s text-error-600 mt-2;
  }
}
</style>
