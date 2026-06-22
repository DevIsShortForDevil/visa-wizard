<template>
  <div class="jw-vw-wizard-main">
    <WizardStepper />
    <div class="w-full">
      <WizardSteps />
    </div>
  </div>
</template>
<script lang="ts" setup>
import WizardStepper from "@/components/wizard/WizardStepper.vue";
import WizardSteps from "@/components/wizard/WizardSteps.vue";
</script>
<style lang="scss" scoped>
.jw-vw-wizard-main {
  @apply w-full border border-gray-300 rounded-2xl border border-gray-200 shadow-elevation-2;
}
</style>
