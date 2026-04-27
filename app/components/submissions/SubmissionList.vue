<script setup lang="ts">
import { SubmissionStatus } from "#shared/types/submission";

const submissionStore = useSubmissionStore();

// Formats date to match "Apr 01, 2026"
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

// Maps the strict SubmissionStatus enum to UI configurations
const getStatusConfig = (status: SubmissionStatus) => {
  switch (status) {
    case SubmissionStatus.Pending:
      return {
        label: "Pending",
        bgClass: "bg-warning-50",
        textClass: "text-warning-600",
        icon: "pending",
      };
    case SubmissionStatus.Approved:
      return {
        label: "Approved",
        bgClass: "bg-success-50",
        textClass: "text-success-600",
        icon: "approved",
      };
    case SubmissionStatus.Rejected:
    default:
      return {
        label: "Rejected",
        bgClass: "bg-error-50",
        textClass: "text-error-600",
        icon: "rejected",
      };
  }
};
</script>

<template>
  <div class="w-full flex flex-col gap-4">
    <div class="flex justify-between items-center w-full mb-2 px-1">
      <h3 class="text-heading-s-semibold text-black">Recent Submissions</h3>
      <span class="text-heading-s font-normal text-black">
        {{ submissionStore.submissions.length }} Record{{
          submissionStore.submissions.length > 1 ? "s" : ""
        }}
      </span>
    </div>

    <template v-if="submissionStore.submissions.length > 0">
      <div
        v-for="(sub, index) in submissionStore.submissions"
        :key="index"
        class="flex flex-col md:flex-row md:items-center justify-between p-5 gap-4 md:gap-0 bg-white rounded-2xl border border-gray-100 shadow-elevation-2"
      >
        <div class="flex items-center gap-5 w-full md:w-auto">
          <div class="flex items-center">
            <img
              v-if="sub.citizenship?.flag"
              :src="sub.citizenship.flag"
              alt="Origin"
              class="relative z-10 w-10 h-10 object-cover rounded-full border-2 border-white shrink-0"
            />
            <div
              v-else
              class="relative z-10 w-10 h-10 rounded-full bg-gray-100 border-2 border-white shrink-0"
            ></div>

            <img
              v-if="sub.destination?.flag"
              :src="sub.destination.flag"
              alt="Destination"
              class="relative z-0 w-10 h-10 object-cover rounded-full border-2 border-white shrink-0 -ml-3"
            />
            <div
              v-else
              class="relative z-0 w-10 h-10 rounded-full bg-gray-100 border-2 border-white shrink-0 -ml-3"
            ></div>
          </div>

          <div class="flex flex-col gap-0.5">
            <span class="text-body-xs font-normal text-gray-500">
              {{ sub.fullName || "Unknown User" }}
            </span>
            <div class="flex items-center gap-2 text-body-m-bold text-black">
              <span>{{ sub.citizenship?.name || "Unknown" }}</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4 text-gray-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
              <span>{{ sub.destination?.name || "Unknown" }}</span>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 md:gap-12"
        >
          <div class="flex flex-col gap-0.5">
            <span class="text-body-xs font-normal text-gray-500"
              >Submitted</span
            >
            <span class="text-body-m-bold text-black">
              {{ formatDate(sub.submittedAt) }}
            </span>
          </div>

          <div
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full min-w-[100px] justify-center"
            :class="getStatusConfig(sub.status).bgClass"
          >
            <svg
              v-if="getStatusConfig(sub.status).icon === 'rejected'"
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              :class="getStatusConfig(sub.status).textClass"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <svg
              v-else-if="getStatusConfig(sub.status).icon === 'pending'"
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              :class="getStatusConfig(sub.status).textClass"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <svg
              v-else-if="getStatusConfig(sub.status).icon === 'approved'"
              xmlns="http://www.w3.org/2000/svg"
              class="w-4 h-4"
              :class="getStatusConfig(sub.status).textClass"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>

            <span
              class="text-body-s font-medium"
              :class="getStatusConfig(sub.status).textClass"
            >
              {{ getStatusConfig(sub.status).label }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <div
      v-else
      class="w-full flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-gray-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-7 h-7 text-black mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1.5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span class="text-body-m-bold text-black"
        >No applications submitted yet.</span
      >
    </div>
  </div>
</template>
