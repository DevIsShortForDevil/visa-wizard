<template>
  <div class="relative">
    <Transition :name="wizardStore.transitionDirection" mode="out-in">
      <component
        :is="currentComponent"
        @next="wizardStore.nextStep()"
        @back="wizardStore.prevStep()"
      />
    </Transition>
  </div>
</template>
<script setup lang="ts">
import GeographyStep from "@/components/wizard/steps/GeographyStep.vue";
import IdentityStep from "@/components/wizard/steps/IdentityStep.vue";
import VerificationStep from "@/components/wizard/steps/VerificationStep.vue";

// State Management
const wizardStore = useWizardStore();

const stepsComponents = shallowRef([
  GeographyStep,
  IdentityStep,
  VerificationStep,
]);
const currentComponent = computed(
  () => stepsComponents.value[wizardStore.currentStep],
);
</script>
