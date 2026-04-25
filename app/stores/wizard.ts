import type { WizardData } from "#shared/types/wizard";

export const useWizardStore = defineStore("wizard", () => {
  // transition control
  const transitionDirection = ref<"slide-left" | "slide-right">("slide-left");

  // Step Control
  const currentStep = ref(0);
  const nextStep = () => {
    transitionDirection.value = "slide-left";
    if (currentStep.value < 3) {
      currentStep.value += 1;
    }
  };
  const prevStep = () => {
    transitionDirection.value = "slide-right";
    if (currentStep.value > 0) {
      currentStep.value -= 1;
    }
  };

  // Step Data
  const data = reactive<WizardData>({
    citizenship: null,
    destination: null,
    fullName: null,
    email: null,
    phoneNumber: null,
    phoneCountry: null,
    dob: null,
    passportNumber: null,
  });

  const updateData = (stepData: Partial<WizardData>) => {
    Object.assign(data, stepData);
  };

  const resetWizard = () => {
    transitionDirection.value = "slide-right";
    currentStep.value = 0;
    Object.keys(data).forEach((key) => {
      data[key as keyof WizardData] = null;
    });
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    transitionDirection,
    data,
    updateData,
    resetWizard,
  };
});
