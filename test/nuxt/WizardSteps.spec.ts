import { describe, it, expect, vi, beforeEach } from "vitest";
import { mountSuspended, mockNuxtImport } from "@nuxt/test-utils/runtime";
import { ref } from "vue";

// 1. Import the ACTUAL components to guarantee Vue Test Utils can find them
import WizardSteps from "@/components/wizard/WizardSteps.vue";
import GeographyStep from "@/components/wizard/steps/GeographyStep.vue";

// Mock the Pinia store
const mockNextStep = vi.fn();
const mockPrevStep = vi.fn();
mockNuxtImport("useWizardStore", () => {
  return () => ({
    currentStep: 0,
    transitionDirection: "slide-left",
    nextStep: mockNextStep,
    prevStep: mockPrevStep,
  });
});

// Mock the useAsyncData fetch
const mockPending = ref(false);
const mockRawCountries = ref([
  {
    name: { common: "Canada" },
    cca2: "CA",
    flags: { svg: "canada-flag.svg" },
    idd: { root: "+1", suffixes: [""] },
    population: 40000000,
    continents: ["North America"],
  },
]);

mockNuxtImport("useAsyncData", () => {
  return async () => ({
    data: mockRawCountries,
    pending: mockPending,
  });
});

describe("WizardSteps Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPending.value = false; // Reset to default loaded state
  });

  it("displays the loading state when pending is true", async () => {
    mockPending.value = true;

    const wrapper = await mountSuspended(WizardSteps, {
      global: {
        // 2. Bypass the transition completely so it renders instantly
        stubs: { Transition: { template: "<slot />" } },
      },
    });

    expect(wrapper.text()).toContain("Loading application resources...");

    // Use the imported component instead of a string name!
    expect(wrapper.findComponent(GeographyStep).exists()).toBe(false);
  });

  it("renders the correct component and passes the mapped countries", async () => {
    const wrapper = await mountSuspended(WizardSteps, {
      global: {
        stubs: {
          Transition: { template: "<slot />" }, // Force instant rendering
          GeographyStep: true, // Tell VTU to safely stub these children
          IdentityStep: true,
          VerificationStep: true,
        },
      },
    });

    // 3. Find the component using the actual imported object.
    // This will NEVER fail, regardless of how Vue names the component internally.
    const geoStep = wrapper.findComponent(GeographyStep);
    expect(geoStep.exists()).toBe(true);

    // Verify the API response was mapped to our CountryOption interface correctly
    const passedCountries = geoStep.props("countries");
    expect(passedCountries).toHaveLength(1);
    expect(passedCountries[0]).toEqual({
      id: "CA",
      name: "Canada",
      flag: "canada-flag.svg",
      phoneCode: "+1",
      population: 40000000,
      continent: "North America",
    });
  });

  it("calls store methods when children emit next or back events", async () => {
    const wrapper = await mountSuspended(WizardSteps, {
      global: {
        stubs: {
          Transition: { template: "<slot />" },
          GeographyStep: true,
        },
      },
    });

    const geoStep = wrapper.findComponent(GeographyStep);

    // Simulate emitting the 'next' event from the stubbed child
    await geoStep.vm.$emit("next");
    expect(mockNextStep).toHaveBeenCalledTimes(1);

    // Simulate emitting the 'back' event from the stubbed child
    await geoStep.vm.$emit("back");
    expect(mockPrevStep).toHaveBeenCalledTimes(1);
  });
});
