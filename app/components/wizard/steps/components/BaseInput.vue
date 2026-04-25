<script setup lang="ts">
const model = defineModel<string>();

defineProps({
  label: { type: String, required: true },
  type: { type: String, default: "text" },
  placeholder: { type: String, default: "" },
  error: { type: String, default: "" },
});
</script>

<template>
  <div class="flex flex-col">
    <label class="text-input-label text-gray-700 mb-2">{{ label }}</label>
    <input
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      class="w-full rounded-xl border bg-white py-3 px-4 text-body-m text-gray-900 outline-none transition-colors placeholder:text-gray-400"
      :class="
        error
          ? 'border-error-400 focus:ring-1 focus:ring-error-400'
          : 'border-gray-300 hover:border-gray-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600'
      "
    />
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
