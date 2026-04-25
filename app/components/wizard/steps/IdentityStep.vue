<script setup lang="ts">
import { z } from "zod";
import BaseInput from "./components/BaseInput.vue";
import PhoneInput from "./components/PhoneInput.vue";
import DatePicker from "./components/DatePicker.vue";
import StepFooter from "./components/StepFooter.vue";

const props = defineProps({
  countries: {
    type: Array as () => CountryOption[],
    required: true,
  },
});

const emit = defineEmits(["next", "back"]);

// Assuming you have your wizardStore setup globally/auto-imported
const wizardStore = useWizardStore();

// 1. Validation Schema
const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.email("Invalid email address"),
  phoneCountry: z
    .object({
      id: z.string(),
      name: z.string(),
      flag: z.string(),
      phoneCode: z.string(),
    })
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

// 3. Submission
const submitStep = () => {
  if (validate()) {
    wizardStore.updateData(data); // Save this step's data
    emit("next", data);
  }
};
</script>

<template>
  <div class="bg-white rounded-b-2xl shadow-sm">
    <div class="flex flex-col gap-10 px-7 py-11">
      <div class="flex flex-col gap-1.5">
        <h2 class="text-heading-l-bold text-black">Personal Details</h2>
        <p class="text-heading-xs text-black">
          Please provide accurate information as it appears on your official
          documents.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
        <BaseInput
          v-model="data.fullName"
          @update:modelValue="validateField('fullName')"
          label="Full Name"
          placeholder="John Snow"
          :error="getError('fullName')"
        />

        <BaseInput
          v-model="data.email"
          @update:modelValue="validateField('email')"
          type="email"
          label="Email Address"
          :error="getError('email')"
        />

        <PhoneInput
          v-model:country="data.phoneCountry"
          v-model:number="data.phoneNumber"
          @update:country="validateField('phoneCountry')"
          @update:number="validateField('phoneNumber')"
          :countries="props.countries"
          label="Phone Number"
          :error="getError('phoneNumber') || getError('phoneCountry')"
        />

        <DatePicker
          v-model="data.dob"
          @update:modelValue="validateField('dob')"
          label="Date of Birth"
          :error="getError('dob')"
        />

        <div class="md:col-span-1">
          <BaseInput
            v-model="data.passportNumber"
            @update:modelValue="validateField('passportNumber')"
            label="Passport Number"
            :error="getError('passportNumber')"
          />
        </div>
      </div>
    </div>
    <StepFooter @next="submitStep" @back="emit('back')" />
  </div>
</template>
