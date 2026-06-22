export const useSubmissionStore = defineStore(
  "submissions",
  () => {
    const submissions = ref<Submission[]>([]);

    const addSubmission = (data: WizardData) => {
      submissions.value.splice(0, 0, {
        ...data,
        submittedAt: new Date(),
        status: Math.floor(Math.random() * 3), // Random status for demo purposes
      });
    };

    return {
      submissions,
      addSubmission,
    };
  },
  {
    persist: true,
  },
);
