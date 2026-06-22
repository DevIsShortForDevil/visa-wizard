<template>
  <div class="jw-vw-submission-list">
    <div class="jw-vw-submission-list-header">
      <h3 class="jw-vw-submission-list-header-title">Recent Submissions</h3>
      <span class="jw-vw-submission-list-header-record-count">
        {{ submissionStore.submissions.length }} Record{{
          submissionStore.submissions.length > 1 ? "s" : ""
        }}
      </span>
    </div>

    <template v-if="submissionStore.submissions.length > 0">
      <TransitionGroup
        tag="div"
        class="jw-vw-submission-list-items"
        name="submission"
      >
        <div
          v-for="sub in submissionStore.submissions"
          :key="sub.submittedAt.toString()"
          class="jw-vw-submission-list-item"
        >
          <div class="jw-vw-submission-list-item-main">
            <div class="flex items-center">
              <img
                v-if="sub.citizenship?.flag"
                :src="sub.citizenship.flag"
                :alt="sub.citizenship.flagAlt"
                class="jw-vw-submission-list-item-flag"
              />
              <div
                v-else
                class="jw-vw-submission-list-item-flag bg-gray-100"
              ></div>

              <img
                v-if="sub.destination?.flag"
                :src="sub.destination.flag"
                :alt="sub.destination.flagAlt"
                class="jw-vw-submission-list-item-flag -ml-3"
              />
              <div
                v-else
                class="jw-vw-submission-list-item-flag bg-gray-100 -ml-3"
              ></div>
            </div>

            <div class="flex flex-col gap-0.5">
              <span class="jw-vw-submission-list-item-name">
                {{ sub.fullName || "Unknown User" }}
              </span>
              <div class="jw-vw-submission-list-item-route">
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

          <div class="jw-vw-submission-list-item-submit-at">
            <div class="flex flex-col gap-0.5">
              <span class="text-body-xs font-normal text-gray-500"
                >Submitted</span
              >
              <span class="text-body-m-bold text-black">
                {{ formatDate(sub.submittedAt) }}
              </span>
            </div>

            <div
              class="jw-vw-submission-list-item-status"
              :class="statusConfig[sub.status].bgClass"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-4 h-4"
                :class="statusConfig[sub.status].textClass"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  :d="statusConfig[sub.status].path"
                />
              </svg>

              <span
                class="text-body-s font-medium"
                :class="statusConfig[sub.status].textClass"
              >
                {{ statusConfig[sub.status].label }}
              </span>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </template>

    <div v-else class="jw-vw-submission-list-empty">
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
      <span class="text-body-m-bold text-black">
        No applications submitted yet.
      </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { SubmissionStatus } from "#shared/enums";

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
const statusConfig = {
  [SubmissionStatus.Pending]: {
    label: SubmissionStatus[SubmissionStatus.Pending],
    bgClass: "bg-warning-50",
    textClass: "text-warning-600",
    path: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  [SubmissionStatus.Approved]: {
    label: SubmissionStatus[SubmissionStatus.Approved],
    bgClass: "bg-success-50",
    textClass: "text-success-600",
    path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  [SubmissionStatus.Rejected]: {
    label: SubmissionStatus[SubmissionStatus.Rejected],
    bgClass: "bg-error-50",
    textClass: "text-error-600",
    path: "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
};
</script>

<style lang="scss" scoped>
.jw-vw-submission-list {
  @apply w-full flex flex-col gap-4;

  .jw-vw-submission-list-header {
    @apply flex justify-between items-center w-full mb-2 px-1;

    .jw-vw-submission-list-header-title {
      @apply text-heading-s-semibold text-black;
    }

    .jw-vw-submission-list-header-record-count {
      @apply text-heading-s font-normal text-black;
    }
  }

  .jw-vw-submission-list-items {
    @apply w-full flex flex-col gap-4;

    .jw-vw-submission-list-item {
      @apply flex flex-col md:flex-row md:items-center justify-between p-5 gap-4 md:gap-0 bg-white rounded-2xl border border-gray-100 shadow-elevation-2;

      .jw-vw-submission-list-item-main {
        @apply flex items-center gap-5 w-full md:w-auto;

        .jw-vw-submission-list-item-flag {
          @apply relative z-20 w-10 h-10 object-cover rounded-full border-2 border-white shrink-0;
        }

        .jw-vw-submission-list-item-name {
          @apply text-body-xs font-normal text-gray-500;
        }

        .jw-vw-submission-list-item-route {
          @apply flex items-center gap-2 text-body-m-bold text-black;
        }
      }

      .jw-vw-submission-list-item-submit-at {
        @apply flex items-center justify-between md:justify-end w-full md:w-auto gap-4 md:gap-12;
      }

      .jw-vw-submission-list-item-status {
        @apply flex items-center gap-1.5 px-3 py-1.5 rounded-full min-w-[6.25rem] justify-center;
      }
    }
  }

  .jw-vw-submission-list-empty {
    @apply w-full flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed border-gray-200;
  }
}
</style>
