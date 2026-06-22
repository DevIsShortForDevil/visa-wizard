<template>
  <div class="jw-vw-geography-step">
    <div class="jw-vw-geography-step-main">
      <div class="jw-vw-geography-step-main-header">
        <h2 class="jw-vw-geography-step-main-header-title">
          Select your journey
        </h2>
        <p class="jw-vw-geography-step-main-header-subtitle">
          Define your origin and destination to begin the application process.
        </p>
      </div>

      <div class="jw-vw-geography-step-main-body">
        <div class="jw-vw-geography-step-main-body-fields">
          <CountrySelect
            v-model="data.citizenship"
            :exclude="data.destination"
            label="Citizenship"
            :error="getError('citizenship')"
            @update:modelValue="validateField('citizenship')"
          />

          <CountrySelect
            v-model="data.destination"
            :exclude="data.citizenship"
            label="Destination"
            :error="getError('destination')"
            @update:modelValue="validateField('destination')"
          />
        </div>

        <!-- Route Preview -->
        <div class="jw-vw-geography-step-main-body-route">
          <transition
            enter-active-class="transition duration-400 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-300 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <div
              v-if="data.citizenship && data.destination"
              class="jw-vw-geography-step-main-body-route-content"
            >
              <div class="flex items-center gap-4">
                <div class="flex items-center">
                  <img
                    :src="data.citizenship.flag"
                    alt="Origin Flag"
                    class="jw-vw-geography-step-main-body-route-content-flag"
                  />
                  <img
                    :src="data.destination.flag"
                    alt="Destination Flag"
                    class="jw-vw-geography-step-main-body-route-content-flag -ml-2.5"
                  />
                </div>

                <div class="flex flex-col">
                  <span
                    class="jw-vw-geography-step-main-body-route-content-title"
                    >Route Validated</span
                  >
                  <div
                    class="jw-vw-geography-step-main-body-route-content-summary"
                  >
                    <span>{{ data.citizenship.name }}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-4 h-4 text-gray-400 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="black"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                    <span>{{ data.destination.name }}</span>
                  </div>
                </div>
              </div>

              <div class="jw-vw-geography-step-main-body-route-content-valid">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-4 h-4 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <StepFooter :render-back="false" @next="submitStep" />
  </div>
</template>

<script setup lang="ts">
import CountrySelect from "@/components/wizard/steps/components/CountrySelect.vue";
import StepFooter from "@/components/wizard/steps/components/StepFooter.vue";

import { z } from "zod";

const emit = defineEmits(["next", "back"]);

const wizardStore = useWizardStore();

// Define the main schema for the step
// z.custom<CountryOption>() is used to ensure that the value is of type CountryOption
const schema = z.object({
  citizenship: z
    .custom<CountryOption>()
    .nullable()
    .refine((val) => val !== null, { message: "Citizenship is required" }),
  destination: z
    .custom<CountryOption>()
    .nullable()
    .refine((val) => val !== null, { message: "Destination is required" }),
});

const initialValue: {
  citizenship: CountryOption | null;
  destination: CountryOption | null;
} = {
  citizenship: wizardStore.data?.citizenship || null,
  destination: wizardStore.data?.destination || null,
};

// Initialize Zod Form
const { data, getError, validate, validateField } = useZodForm(
  schema,
  initialValue,
);

// Submission
const submitStep = () => {
  if (validate()) {
    wizardStore.updateData(data);
    emit("next", data);
  }
};
</script>

<style lang="scss" scoped>
.jw-vw-geography-step {
  @apply bg-white rounded-b-2xl shadow-sm;

  .jw-vw-geography-step-main {
    @apply flex flex-col gap-10 px-4 xs:px-7 py-11;

    .jw-vw-geography-step-main-header {
      @apply flex flex-col gap-1.5;

      .jw-vw-geography-step-main-header-title {
        @apply text-heading-l-bold text-black;
      }

      .jw-vw-geography-step-main-header-subtitle {
        @apply text-heading-xs text-black;
      }
    }

    .jw-vw-geography-step-main-body {
      @apply w-full flex flex-col gap-3;

      .jw-vw-geography-step-main-body-fields {
        @apply grid grid-cols-1 md:grid-cols-2 gap-4;
      }

      .jw-vw-geography-step-main-body-route {
        @apply w-full min-h-[3.8125rem];

        .jw-vw-geography-step-main-body-route-content {
          @apply h-full flex items-center justify-between px-1 md:px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl;

          .jw-vw-geography-step-main-body-route-content-flag {
            @apply relative z-10 min-w-7 min-h-7 w-7 h-7 object-cover rounded-full border-2 border-white shadow-sm shrink-0;
          }

          .jw-vw-geography-step-main-body-route-content-title {
            @apply text-body-xs font-normal text-gray-700;
          }

          .jw-vw-geography-step-main-body-route-content-summary {
            @apply flex items-center gap-2 text-body-m-bold text-black;
          }

          .jw-vw-geography-step-main-body-route-content-valid {
            @apply flex items-center justify-center w-6 h-6 bg-success-400 rounded-full shrink-0 shadow-sm;
          }
        }
      }
    }
  }
}
</style>
