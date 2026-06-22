<template>
  <div class="jw-vw-wizard-stepper">
    <div class="jw-vw-wizard-stepper-steps">
      <template v-for="(step, index) in steps" :key="`step-${index}`">
        <div class="jw-vw-wizard-stepper-step">
          <div class="jw-vw-wizard-stepper-step-content">
            <div
              :class="[
                'jw-vw-wizard-stepper-step-icon',
                wizardStore.currentStep < index
                  ? 'bg-primary-100'
                  : 'bg-primary-700',
              ]"
            >
              <Icon :name="`tva:${step.icon}`" class="w-4.5 h-4.5" />
            </div>
            <h2
              :class="[
                'jw-vw-wizard-stepper-step-title',
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
            'jw-vw-wizard-stepper-step-divider',
            wizardStore.currentStep < index + 1
              ? 'border-primary-100'
              : 'border-primary-700',
          ]"
        ></div>
      </template>
    </div>
  </div>
</template>

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
<style lang="scss" scoped>
.jw-vw-wizard-stepper {
  @apply w-full h-[4.25rem] bg-gray-200 rounded-t-2xl;
  .jw-vw-wizard-stepper-steps {
    @apply flex items-center h-full px-8;
    .jw-vw-wizard-stepper-step {
      @apply flex items-center gap-2 flex-shrink-0;
      .jw-vw-wizard-stepper-step-content {
        @apply flex items-center gap-2;
        .jw-vw-wizard-stepper-step-icon {
          @apply flex justify-center items-center w-7 h-7 rounded-full;
        }
        .jw-vw-wizard-stepper-step-title {
          @apply text-body-s hidden xs:block;
        }
      }
    }
    .jw-vw-wizard-stepper-step-divider {
      @apply flex-1 border-t border-dashed mx-4;
    }
  }
}
</style>
