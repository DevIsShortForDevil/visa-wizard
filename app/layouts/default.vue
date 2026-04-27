<template>
  <div class="flex flex-col w-full min-w-[31.25rem]">
    <header
      class="sticky top-0 z-50 w-full h-[4.5rem] flex items-center border-b border-gray-200 bg-white py-5.5 px-11 shadow-sm"
    >
      <Icon
        name="tva:wizard"
        class="w-6 h-6 mr-2 cursor-pointer"
        @click="wizardStore.resetWizard()"
      />
      <h1
        class="text-heading-s-bold font-sans text-primary-800 mt-1 cursor-pointer"
        @click="wizardStore.resetWizard()"
      >
        Visa Wizard
      </h1>
    </header>

    <main class="w-full px-3 py-4 sm:px-5 md:px-11">
      <slot></slot>
    </main>
  </div>
</template>

<script setup>
const router = useRouter();
const wizardStore = useWizardStore();
</script>
