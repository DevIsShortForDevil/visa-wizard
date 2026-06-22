<template>
  <div class="jw-vw-layout">
    <header class="jw-vw-layout-header">
      <Icon
        name="tva:wizard"
        class="w-6 h-6 mr-2 cursor-pointer"
        @click="wizardStore.resetWizard()"
      />
      <h1 class="jw-vw-layout-header-title" @click="wizardStore.resetWizard()">
        Visa Wizard
      </h1>
    </header>

    <main class="jw-vw-layout-main">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
const wizardStore = useWizardStore();
</script>

<style lang="scss" scoped>
.jw-vw-layout {
  @apply flex flex-col w-full min-w-[25rem];
  .jw-vw-layout-header {
    @apply sticky top-0 z-[100] w-full h-[4.5rem] flex items-center border-b border-gray-200 bg-white py-[1.375rem] px-11 shadow-sm;

    .jw-vw-layout-header-title {
      @apply text-heading-s-bold font-sans text-primary-800 mt-1 cursor-pointer;
    }
  }
  .jw-vw-layout-main {
    @apply w-full px-3 py-4 sm:px-5 md:px-11;
  }
}
</style>
