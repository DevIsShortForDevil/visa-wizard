<template>
  <div class="jw-vw-verification-step">
    <div class="jw-vw-verification-step-content">
      <div class="jw-vw-verification-step-header">
        <h2 class="text-heading-l-bold text-black">Review & Confirm</h2>
        <p class="text-heading-xs text-black">
          Final check of your application data before submission.
        </p>
      </div>

      <div class="jw-vw-verification-step-main">
        <div class="jw-vw-verification-step-main-summary">
          <div class="jw-vw-main-summary-item">
            <span class="jw-vw-summary-item-name">Name</span>
            <span class="jw-vw-summary-item-value">
              {{ data.fullName || "-" }}
            </span>
          </div>
          <div class="jw-vw-main-summary-item">
            <span class="jw-vw-summary-item-name">Email</span>
            <span class="jw-vw-summary-item-value">
              {{ data.email || "-" }}
            </span>
          </div>
          <div class="jw-vw-main-summary-item">
            <span class="jw-vw-summary-item-name">Phone</span>
            <span class="jw-vw-summary-item-value">
              {{ formattedPhone }}
            </span>
          </div>
          <div class="jw-vw-main-summary-item">
            <span class="jw-vw-summary-item-name">DOB</span>
            <span class="jw-vw-summary-item-value">
              {{ formattedDob }}
            </span>
          </div>
          <div class="jw-vw-main-summary-item">
            <span class="jw-vw-summary-item-name">Passport</span>
            <span class="jw-vw-summary-item-value">
              {{ data.passportNumber || "-" }}
            </span>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="jw-vw-verification-step-main-route">
            <img
              v-if="data.citizenship?.flag"
              :src="data.citizenship.flag"
              :alt="data.citizenship.flagAlt"
              class="jw-vw-verification-step-route-flag"
            />
            <div v-else class="jw-vw-verification-step-route-flag__empty"></div>

            <div class="flex flex-col">
              <span class="jw-vw-verification-step-route-title">
                Citizenship
              </span>
              <span class="jw-vw-verification-step-route-name">
                {{ data.citizenship?.name || "-" }}
              </span>
              <span
                v-if="data.citizenship"
                class="jw-vw-verification-step-route-meta"
              >
                Pop: {{ formatPopulation(data.citizenship.population) }} •
                {{ data.citizenship.region }}
              </span>
            </div>
          </div>

          <div class="jw-vw-verification-step-main-route">
            <img
              v-if="data.destination?.flag"
              :src="data.destination.flag"
              :alt="data.destination.flagAlt"
              class="jw-vw-verification-step-route-flag"
            />
            <div v-else class="jw-vw-verification-step-route-flag__empty"></div>

            <div class="flex flex-col">
              <span class="jw-vw-verification-step-route-title">
                Destination
              </span>
              <span class="jw-vw-verification-step-route-name">
                {{ data.destination?.name || "-" }}
              </span>
              <span
                v-if="data.destination"
                class="jw-vw-verification-step-route-meta"
              >
                Pop: {{ formatPopulation(data.destination.population) }} •
                {{ data.destination.region }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="jw-vw-verification-step-info-alert">
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
        <p class="jw-vw-verification-step-info-alert-text">
          By clicking {{ nextBtnTitle }}, you confirm that all provided
          information is true and accurate. False information may result in
          immediate rejection.
        </p>
      </div>
    </div>

    <StepFooter
      :next-title="nextBtnTitle"
      @next="submitApplication"
      @back="emit('back')"
    />
  </div>
</template>

<script setup lang="ts">
import StepFooter from "@/components/wizard/steps/components/StepFooter.vue";

const emit = defineEmits(["submit", "back"]);

const wizardStore = useWizardStore();
const data = wizardStore.data;

const submissionStore = useSubmissionStore();

const nextBtnTitle = "Submit Application";

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

<style lang="scss" scoped>
.jw-vw-verification-step {
  @apply bg-white rounded-b-2xl shadow-sm;

  .jw-vw-verification-step-content {
    @apply flex flex-col px-4 xs:px-7 py-11;

    .jw-vw-verification-step-header {
      @apply flex flex-col gap-1.5 mb-8;
    }

    .jw-vw-verification-step-main {
      @apply grid grid-cols-1 md:grid-cols-2 gap-6 mb-8;

      .jw-vw-verification-step-main-summary {
        @apply flex flex-col justify-center gap-4 border border-gray-200 rounded-xl px-5 py-6;

        .jw-vw-main-summary-item {
          @apply flex justify-between items-center;

          .jw-vw-summary-item-name {
            @apply text-body-m text-gray-500;
          }

          .jw-vw-summary-item-value {
            @apply text-body-m-bold text-black;
          }
        }
      }

      .jw-vw-verification-step-main-route {
        @apply flex items-center gap-4 border border-gray-200 rounded-xl p-5 h-full;

        .jw-vw-verification-step-route-flag {
          @apply w-10 h-10 rounded-full object-cover shrink-0 border border-gray-100;
        }

        .jw-vw-verification-step-route-flag__empty {
          @apply w-10 h-10 rounded-full bg-gray-100 shrink-0;
        }

        .jw-vw-verification-step-route-title {
          @apply text-body-xs font-normal text-gray-500 mb-0.5;
        }

        .jw-vw-verification-step-route-name {
          @apply text-body-m-bold text-black;
        }

        .jw-vw-verification-step-route-meta {
          @apply text-body-xs text-gray-500 mt-0.5;
        }
      }
    }

    .jw-vw-verification-step-info-alert {
      @apply flex items-start gap-3 bg-info-50 border border-info-200 rounded-xl p-4;

      .jw-vw-verification-step-info-alert-text {
        @apply text-body-m text-gray-900 leading-relaxed;
      }
    }
  }
}
</style>
