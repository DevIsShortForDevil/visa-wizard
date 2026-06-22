<template>
  <div class="hidden"></div>
</template>
<script setup lang="ts">
const props = defineProps<{ open: boolean }>();

const emit = defineEmits<{
  open: [isOpen: boolean];
}>();

watch(
  () => props.open,
  (val) => {
    emit("open", !!val);
  },
);
</script>
