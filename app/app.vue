<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
<script lang="ts" setup></script>
<style>
/* This guarantees the absolute bottom layer of the browser is gray */
html,
body {
  @apply bg-gray-50;
  margin: 0;
  padding: 0;
}
</style>
