<template>
  <div class="flex flex-col h-screen w-screen">
    <header
      class="w-full h-[4.5rem] flex items-center flex-shrink-0 border-b border-gray-200 bg-white py-5.5 px-11 elevation-1"
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
    <main class="w-full h-[calc(100vh-4.5rem)] flex bg-gray-50">
      <div
        class="w-full h-auto overflow-y-auto py-4 px-11 [scrollbar-gutter:stable]"
      >
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<script setup>
const router = useRouter();

const wizardStore = useWizardStore();
</script>
