<template>
  <div class="jw-vw-base-input">
    <label class="jw-vw-base-input-label">{{ label }}</label>
    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      class="jw-vw-base-input-input"
      :class="
        error
          ? 'jw-vw-base-input-input__error'
          : 'jw-vw-base-input-input__primary'
      "
    />
    <div class="relative h-5">
      <transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-1"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-1"
      >
        <span v-if="error" class="jw-vw-base-input-error">
          {{ error }}
        </span>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
const {
  label,
  type = "text",
  placeholder,
  error,
} = defineProps<{
  label: string;
  type?: string;
  placeholder?: string;
  error?: string;
}>();

const model = defineModel<string>();
</script>

<style lang="scss" scoped>
.jw-vw-base-input {
  @apply flex flex-col;

  .jw-vw-base-input-label {
    @apply text-input-label text-gray-700 mb-2;
  }

  .jw-vw-base-input-input {
    @apply w-full rounded-xl border bg-white py-3 px-4 text-body-m text-gray-900 outline-none transition-colors placeholder:text-gray-400;

    &.__error {
      @apply border-error-400 focus:ring-1 focus:ring-error-400;
    }

    &.__primary {
      @apply border-gray-300 hover:border-gray-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600;
    }
  }

  .jw-vw-base-input-error {
    @apply absolute z-10 text-body-s text-error-600 mt-2;
  }
}
</style>
