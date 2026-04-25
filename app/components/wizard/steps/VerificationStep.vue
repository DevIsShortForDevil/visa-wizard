<script setup lang="ts">
import { computed } from "vue";
import StepFooter from "./components/StepFooter.vue";

const emit = defineEmits(["submit", "back"]);

const wizardStore = useWizardStore();
const data = wizardStore.data;

const submissionStore = useSubmissionStore();

// Format Date to "Month DD, YYYY"
const formattedDob = computed(() => {
  if (!data.dob) return "-";
  const date = new Date(data.dob);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
});

// Format Phone Number
const formattedPhone = computed(() => {
  const code = data.phoneCountry?.phoneCode || "";
  const number = data.phoneNumber || "";
  return `${code}${number}` || "-";
});

// Format Population with commas
const formatPopulation = (pop?: number) => {
  if (!pop) return "Unknown";
  return new Intl.NumberFormat("en-US").format(pop);
};

// Submission Handler
const submitApplication = () => {
  submissionStore.addSubmission(wizardStore.data);
  wizardStore.resetWizard();
};
</script>

<template>
  <div class="bg-white rounded-b-2xl shadow-sm">
    <div class="flex flex-col px-7 py-11">
      <div class="flex flex-col gap-1.5 mb-8">
        <h2 class="text-heading-l-bold text-black">Review & Confirm</h2>
        <p class="text-heading-xs text-black">
          Final check of your application data before submission.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div
          class="flex flex-col justify-center gap-4 border border-gray-200 rounded-xl px-5 py-6"
        >
          <div class="flex justify-between items-center">
            <span class="text-body-m text-gray-500">Name</span>
            <span class="text-body-m-bold text-black">{{
              data.fullName || "-"
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-body-m text-gray-500">Email</span>
            <span class="text-body-m-bold text-black">{{
              data.email || "-"
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-body-m text-gray-500">Phone</span>
            <span class="text-body-m-bold text-black">{{
              formattedPhone
            }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-body-m text-gray-500">DOB</span>
            <span class="text-body-m-bold text-black">{{ formattedDob }}</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-body-m text-gray-500">Passport</span>
            <span class="text-body-m-bold text-black">{{
              data.passportNumber || "-"
            }}</span>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div
            class="flex items-center gap-4 border border-gray-200 rounded-xl p-5 h-full"
          >
            <img
              v-if="data.citizenship?.flag"
              :src="data.citizenship.flag"
              alt="Citizenship Flag"
              class="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full bg-gray-100 shrink-0"
            ></div>

            <div class="flex flex-col">
              <span class="text-body-xs font-normal text-gray-500 mb-0.5"
                >Citizenship</span
              >
              <span class="text-body-m-bold text-black">{{
                data.citizenship?.name || "-"
              }}</span>
              <span
                v-if="data.citizenship"
                class="text-[13px] text-gray-500 mt-0.5"
              >
                Pop: {{ formatPopulation(data.citizenship.population) }} •
                {{ data.citizenship.continent }}
              </span>
            </div>
          </div>

          <div
            class="flex items-center gap-4 border border-gray-200 rounded-xl p-5 h-full"
          >
            <img
              v-if="data.destination?.flag"
              :src="data.destination.flag"
              alt="Destination Flag"
              class="w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100"
            />
            <div
              v-else
              class="w-10 h-10 rounded-full bg-gray-100 shrink-0"
            ></div>

            <div class="flex flex-col">
              <span class="text-body-xs font-normal text-gray-500 mb-0.5"
                >Destination</span
              >
              <span class="text-body-m-bold text-black">{{
                data.destination?.name || "-"
              }}</span>
              <span
                v-if="data.destination"
                class="text-[13px] text-gray-500 mt-0.5"
              >
                Pop: {{ formatPopulation(data.destination.population) }} •
                {{ data.destination.continent }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        class="flex items-start gap-3 bg-info-50 border border-info-200 rounded-xl p-4"
      >
        <div class="shrink-0 mt-0.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-info-500"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <p class="text-body-m text-gray-900 leading-relaxed">
          By clicking "Submit Application", you confirm that all provided
          information is true and accurate. False information may result in
          immediate rejection.
        </p>
      </div>
    </div>

    <StepFooter
      next-title="Submit Application"
      @next="submitApplication"
      @back="emit('back')"
    />
  </div>
</template>
