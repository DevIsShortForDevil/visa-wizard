<script setup lang="ts">
import { ref, computed, shallowRef } from "vue";
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

// Fetch data ONCE at the top level
const { data: rawCountries, pending } = await useAsyncData("countries", () =>
  $fetch<Country[]>(
    "https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd,population,continents",
  ),
);

// Format the list
const countryList = computed((): CountryOption[] => {
  if (!rawCountries.value) return [];
  return rawCountries.value
    .map((c) => {
      const root = c.idd?.root || "";
      const suffix = c.idd?.suffixes?.[0] || "";
      const phoneCode = `${root}${suffix}`;

      return {
        id: c.cca2,
        name: c.name.common,
        flag: c.flags.svg,
        phoneCode,
        population: c.population,
        continent: c.continents?.[0] || "",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
});
</script>

<template>
  <div v-if="pending" class="text-center text-gray-500">
    Loading application resources...
  </div>

  <div v-else class="relative">
    <Transition :name="wizardStore.transitionDirection" mode="out-in">
      <component
        :is="currentComponent"
        :countries="countryList"
        @next="wizardStore.nextStep()"
        @back="wizardStore.prevStep()"
      />
    </Transition>
  </div>
</template>

<style scoped>
/* Forward Transition (Slide Left) */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease-out;
}
.slide-left-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

/* Backward Transition (Slide Right) */
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.3s ease-out;
}
.slide-right-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.slide-right-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
