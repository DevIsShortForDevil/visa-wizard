<script lang="ts" setup>
const wizardStore = useWizardStore();

const steps = [
  {
    title: "Geography",
    icon: "globe",
  },
  {
    title: "Identity",
    icon: "checklist",
  },
  {
    title: "Verfiction",
    icon: "checkcircle",
  },
];
</script>

<template>
  <div class="w-full h-[4.25rem] bg-gray-200 rounded-t-2xl">
    <div class="flex items-center h-full px-8">
      <template v-for="(step, index) in steps" :key="`step-${index}`">
        <div class="flex items-center gap-2 flex-shrink-0">
          <div class="flex items-center gap-2">
            <div
              :class="[
                'flex justify-center items-center w-7 h-7 rounded-full',
                wizardStore.currentStep < index
                  ? 'bg-primary-100'
                  : 'bg-primary-700',
              ]"
            >
              <Icon :name="`tva:${step.icon}`" class="w-4.5 h-4.5" />
            </div>
            <h2
              :class="[
                'text-body-s',
                wizardStore.currentStep < index
                  ? 'text-primary-100'
                  : 'text-primary-700',
              ]"
            >
              {{ step.title }}
            </h2>
          </div>
        </div>
        <div
          v-if="index < steps.length - 1"
          :class="[
            'flex-1 border-t border-dashed mx-4',
            wizardStore.currentStep < index + 1
              ? 'border-primary-100'
              : 'border-primary-700',
          ]"
        ></div>
      </template>
    </div>
  </div>
</template>
