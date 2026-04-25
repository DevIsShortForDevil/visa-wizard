<script setup lang="ts">
import { render } from "vue";

const props = defineProps({
  nextTitle: { type: String, default: "Continue" },
  renderBack: { type: Boolean, default: true },
});
const emit = defineEmits(["next", "back"]);
</script>
<template>
  <div
    :class="[
      'flex items-center pt-6 px-7 pb-11 border-t border-gray-100',
      renderBack ? 'justify-between' : 'justify-end',
    ]"
  >
    <button
      v-if="renderBack"
      @click="emit('back')"
      class="flex items-center justify-center w-12 h-12 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors text-black"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </button>

    <button
      @click="emit('next')"
      class="flex items-center gap-2 px-4 py-3 bg-primary-600 hover:bg-primary-700 transition-colors text-white text-btn-s rounded-full"
    >
      {{ nextTitle }}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2.5"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>
