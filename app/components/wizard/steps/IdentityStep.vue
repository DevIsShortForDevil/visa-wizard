<template>
  <div class="jw-vw-identity-step">
    <div class="jw-vw-identity-step-main">
      <div class="jw-vw-identity-step-header">
        <h2 class="text-heading-l-bold text-black">Personal Details</h2>
        <p class="text-heading-xs text-black">
          Please provide accurate information as it appears on your official
          documents.
        </p>
      </div>

      <div class="jw-vw-identity-step-content">
        <BaseInput
          v-model="data.fullName"
          label="Full Name"
          placeholder="John Snow"
          :error="getError('fullName')"
          @update:modelValue="validateField('fullName')"
        />

        <BaseInput
          v-model="data.email"
          type="email"
          label="Email Address"
          :error="getError('email')"
          @update:modelValue="validateField('email')"
        />

        <PhoneInput
          v-model:country="data.phoneCountry"
          v-model:number="data.phoneNumber"
          label="Phone Number"
          :error="getError('phoneNumber') || getError('phoneCountry')"
          @update:country="validateField('phoneCountry')"
          @update:number="validateField('phoneNumber')"
        />

        <DatePicker
          v-model="data.dob"
          label="Date of Birth"
          :error="getError('dob')"
          @update:modelValue="validateField('dob')"
        />

        <div class="md:col-span-1">
          <BaseInput
            v-model="data.passportNumber"
            label="Passport Number"
            :error="getError('passportNumber')"
            @update:modelValue="validateField('passportNumber')"
          />
        </div>
      </div>
    </div>
    <StepFooter @next="submitStep" @back="emit('back')" />
  </div>
</template>

<script setup lang="ts">
import { z } from "zod";
import BaseInput from "@/components/wizard/steps/components/BaseInput.vue";
import PhoneInput from "@/components/wizard/steps/components/PhoneInput.vue";
import DatePicker from "@/components/wizard/steps/components/DatePicker.vue";
import StepFooter from "@/components/wizard/steps/components/StepFooter.vue";

const emit = defineEmits(["next", "back"]);

const wizardStore = useWizardStore();

// 1. Validation Schema
const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.email("Invalid email address"),
  phoneCountry: z
    .custom<CountryOption>()
    .nullable()
    .refine((val) => val !== null, { message: "Country code is required" }),
  phoneNumber: z
    .string()
    .min(5, "Phone number must be at least 5 digits")
    .regex(
      /^[\d\s\-]+$/,
      "Phone number can only contain digits, spaces, and hyphens",
    ),
  dob: z
    .date()
    .nullable()
    .refine((val) => val !== null, { message: "Date of birth is required" }),
  passportNumber: z.string().min(5, "Passport number is required"),
});

// 2. Initialize Form (Setting phoneCountry default using store data)
const initialValue = {
  fullName: wizardStore.data?.fullName || "",
  email: wizardStore.data?.email || "",
  // Grabbing citizenship from step 1 to pre-fill the phone code
  phoneCountry: wizardStore.data?.citizenship || null,
  phoneNumber: wizardStore.data?.phoneNumber || "",
  dob: wizardStore.data?.dob || null,
  passportNumber: wizardStore.data?.passportNumber || "",
};

const { data, getError, validate, validateField } = useZodForm(
  schema,
  initialValue,
);

// 3. Submission
const submitStep = () => {
  if (validate()) {
    wizardStore.updateData(data); // Save this step's data
    emit("next", data);
  }
};
</script>

<style lang="scss" scoped>
.jw-vw-identity-step {
  @apply bg-white rounded-b-2xl shadow-sm;

  .jw-vw-identity-step-main {
    @apply flex flex-col gap-10 px-4 xs:px-7 py-11;
  }

  .jw-vw-identity-step-header {
    @apply flex flex-col gap-1.5;
  }

  .jw-vw-identity-step-content {
    @apply grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4;
  }
}
</style>
