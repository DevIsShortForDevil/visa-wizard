<script setup lang="ts">
import { z } from "zod";
import CountrySelect from "./components/CountrySelect.vue";
import StepFooter from "./components/StepFooter.vue";

const props = defineProps({
  countries: {
    type: Array as () => CountryOption[],
    required: true,
  },
});

const emit = defineEmits(["next", "back"]);

const wizardStore = useWizardStore();

// Validation Schema
const countrySchema = z.object({
  id: z.string(),
  name: z.string(),
  flag: z.string(),
  phoneCode: z.string(),
});

// Define the main schema for the step
const schema = z.object({
  citizenship: countrySchema
    .nullable()
    .refine((val) => val !== null, { message: "Citizenship is required" }),
  destination: countrySchema
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
const { data, errors, touched, validate, validateField } = useZodForm(
  schema,
  initialValue,
);

// Helper to get error message for a field
const getError = (field: keyof typeof data) => {
  if (!touched[field]) return "";
  const err = errors.value[field];
  return Array.isArray(err) ? err[0] : err;
};

// Submission
const submitStep = () => {
  if (validate()) {
    wizardStore.updateData(data);
    emit("next", data);
  }
};
</script>

<template>
  <div class="bg-white rounded-b-2xl shadow-sm">
    <div class="flex flex-col gap-10 px-7 py-11">
      <div class="flex flex-col gap-1.5">
        <h2 class="text-heading-l-bold text-black">Select your journey</h2>
        <p class="text-heading-xs text-black">
          Define your origin and destination to begin the application process.
        </p>
      </div>

      <div class="w-full flex flex-col gap-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CountrySelect
            v-model="data.citizenship"
            @update:modelValue="validateField('citizenship')"
            :countries="props.countries"
            :exclude="data.destination"
            label="Citizenship"
            :error="getError('citizenship')"
          />

          <CountrySelect
            v-model="data.destination"
            @update:modelValue="validateField('destination')"
            :countries="props.countries"
            :exclude="data.citizenship"
            label="Destination"
            :error="getError('destination')"
          />
        </div>
        <div class="w-full h-[3.8125rem]">
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
              class="h-full flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl"
            >
              <div class="flex items-center gap-4">
                <div class="flex items-center">
                  <img
                    :src="data.citizenship.flag"
                    alt="Origin Flag"
                    class="relative z-8 w-7 h-7 object-cover rounded-full border-2 border-white shadow-sm shrink-0"
                  />
                  <img
                    :src="data.destination.flag"
                    alt="Destination Flag"
                    class="relative z-9 w-7 h-7 object-cover rounded-full border-2 border-white shadow-sm shrink-0 -ml-2.5"
                  />
                </div>

                <div class="flex flex-col">
                  <span class="text-body-xs font-normal text-gray-700"
                    >Route Validated</span
                  >
                  <div
                    class="flex items-center gap-2 text-body-m-bold text-black"
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

              <div
                class="flex items-center justify-center w-6 h-6 bg-[#00c853] rounded-full shrink-0 shadow-sm"
              >
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
