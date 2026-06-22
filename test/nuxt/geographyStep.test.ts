// =============================================================================
// GeographyStep — Nuxt Component Tests
// =============================================================================
//
// Test plan:
//
// 1. RENDERING
//    - Renders the title and subtitle correctly
//    - Renders two CountrySelect components
//    - Renders StepFooter with renderBack as false
//    - Does not show any error messages on initial render
//
// 2. VALIDATION — error display
//    - Clicking "Continue" without selecting either country shows both error messages
//    - Clicking "Continue" with only citizenship selected shows only destination error
//    - Clicking "Continue" with only destination selected shows only citizenship error
//    - Error messages disappear after valid selection is made
//
// 3. TOUCHED STATE
//    - Errors don't show before user interacts even if fields are invalid
//    - Errors show after @update:modelValue is emitted from CountrySelect
//
// 4. EXCLUDE PROP — same country restriction
//    - citizenship CountrySelect receives destination as exclude prop
//    - destination CountrySelect receives citizenship as exclude prop
//
// 5. STORE INTERACTION
//    - wizardStore.updateData is called with correct data on valid submission
//    - next event is emitted on valid submission
//    - wizardStore.updateData is NOT called when validation fails
//    - next event is NOT emitted when validation fails
//
// 6. STORE HYDRATION
//    - If store has citizenship, citizenship field is pre-populated
//    - If store has destination, destination field is pre-populated
//    - If both fields are pre-populated, route preview is visible
//
// 7. ROUTE PREVIEW
//    - Route preview is hidden when neither country is selected
//    - Route preview is hidden when only one country is selected
//    - Route preview is visible when both countries are selected
//    - Route preview shows correct country names
//
// -----------------------------------------------------------------------------
// Notes on test setup:
//
// - mountSuspended from @nuxt/test-utils/runtime is used to mount components
//   within the full Nuxt environment including auto-imports
//
// - mockNuxtImport is used to mock useWizardStore so we control store state
//   and spy on updateData without touching real Pinia state
//
// - mockComponent is used to stub CountrySelect and StepFooter so they don't
//   make HTTP calls or require their own complex dependencies
//
// - CountrySelect stub emits @update:modelValue to simulate country selection,
//   which is how GeographyStep knows a country was picked
//
// - Since @nuxt/test-utils v4, Nuxt composables must be called inside
//   beforeAll/beforeEach, not at the top level of describe blocks
// =============================================================================

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  mountSuspended,
  mockNuxtImport,
  mockComponent,
} from "@nuxt/test-utils/runtime";
import { defineComponent, h } from "vue";
import GeographyStep from "@/components/wizard/steps/GeographyStep.vue";

// --- Shared mock country data ---
const mockCitizenship: CountryOption = {
  id: "US",
  name: "United States",
  flag: "https://flags.example.com/us.svg",
  flagAlt: "Flag of United States",
  phoneCode: "+1",
  population: 331000000,
  region: "Americas",
  subregion: "Northern America",
  capital: "Washington D.C.",
  languages: ["English"],
};

const mockDestination: CountryOption = {
  id: "FR",
  name: "France",
  flag: "https://flags.example.com/fr.svg",
  flagAlt: "Flag of France",
  phoneCode: "+33",
  population: 67000000,
  region: "Europe",
  subregion: "Western Europe",
  capital: "Paris",
  languages: ["French"],
};

// We use vi.hoisted so the mock refs are available before vi.mock hoisting runs
// const { mockStoreData, mockUpdateData } = vi.hoisted(() => ({
//   mockStoreData: ref<{
//     citizenship: CountryOption | null;
//     destination: CountryOption | null;
//   }>({
//     citizenship: null,
//     destination: null,
//   }),
//   mockUpdateData: vi.fn(),
// }));

// --- Mock useWizardStore ---

const mockUpdateData = vi.fn();
let mockStoreData = {
  citizenship: null as CountryOption | null,
  destination: null as CountryOption | null,
};

mockNuxtImport("useWizardStore", () => () => ({
  data: mockStoreData,
  updateData: mockUpdateData,
}));

// --- Stub CountrySelect ---
// Renders a simple div with data-testid so we can find it and emit events.
// Props are captured so we can assert on exclude values.
mockComponent("@/components/wizard/steps/components/CountrySelect.vue", () =>
  defineComponent({
    name: "CountrySelectStub",
    props: {
      modelValue: Object,
      exclude: Object,
      label: String,
      error: String,
    },
    emits: ["update:modelValue"],
    setup(props, { emit }) {
      return () =>
        h(
          "div",
          {
            "data-testid": `country-select-${props.label?.toLowerCase()}`,
            "data-exclude": props.exclude?.id ?? "",
            "data-error": props.error ?? "",
            onClick: () => emit("update:modelValue", null),
          },
          props.label,
        );
    },
  }),
);

// --- Stub StepFooter ---
// Renders a simple button that emits next/back so we can trigger submission.
mockComponent("@/components/wizard/steps/components/StepFooter.vue", () =>
  defineComponent({
    props: {
      renderBack: Boolean,
      nextTitle: String,
    },
    emits: ["next", "back"],
    setup(props, { emit }) {
      return () =>
        h("div", [
          h(
            "button",
            {
              "data-testid": "next-btn",
              "data-render-back": props.renderBack,
              onClick: () => emit("next"),
            },
            "Continue",
          ),
        ]);
    },
  }),
);

// --- Helpers ---
const mountStep = () => mountSuspended(GeographyStep);

const selectCitizenship = async (
  wrapper: Awaited<ReturnType<typeof mountStep>>,
  country = mockCitizenship,
) => {
  // Directly set via component instance since stub uses emit
  const stubs = wrapper.findAllComponents({ name: "CountrySelectStub" });
  const citizenship = stubs.find((s) => s.props("label") === "Citizenship");
  await citizenship?.vm.$emit("update:modelValue", country);
  await wrapper.vm.$nextTick();
};

const selectDestination = async (
  wrapper: Awaited<ReturnType<typeof mountStep>>,
  country = mockDestination,
) => {
  const stubs = wrapper.findAllComponents({ name: "CountrySelectStub" });
  const destination = stubs.find((s) => s.props("label") === "Destination");
  await destination?.vm.$emit("update:modelValue", country);
  await wrapper.vm.$nextTick();
};

const clickContinue = async (
  wrapper: Awaited<ReturnType<typeof mountStep>>,
) => {
  await wrapper.find('[data-testid="next-btn"]').trigger("click");
  await wrapper.vm.$nextTick();
};

describe("GeographyStep", () => {
  beforeEach(() => {
    // Reset store state and mock calls before each test
    mockStoreData = { citizenship: null, destination: null };
    mockUpdateData.mockClear();
  });

  // ---------------------------------------------------------------------------
  // 1. Rendering
  // ---------------------------------------------------------------------------

  describe("rendering", () => {
    it("renders the title correctly", async () => {
      const wrapper = await mountStep();
      expect(wrapper.text()).toContain("Select your journey");
    });

    it("renders the subtitle correctly", async () => {
      const wrapper = await mountStep();
      expect(wrapper.text()).toContain(
        "Define your origin and destination to begin the application process.",
      );
    });

    it("renders two CountrySelect components", async () => {
      const wrapper = await mountStep();
      expect(
        wrapper.find('[data-testid="country-select-citizenship"]').exists(),
      ).toBe(true);
      expect(
        wrapper.find('[data-testid="country-select-destination"]').exists(),
      ).toBe(true);
    });

    it("renders StepFooter with renderBack as false", async () => {
      const wrapper = await mountStep();
      const nextBtn = wrapper.find('[data-testid="next-btn"]');
      expect(nextBtn.exists()).toBe(true);
      expect(nextBtn.attributes("data-render-back")).toBe("false");
    });

    it("does not show error messages on initial render", async () => {
      const wrapper = await mountStep();
      expect(wrapper.find("[data-error]").attributes("data-error")).toBe("");
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Validation — error display
  // ---------------------------------------------------------------------------

  describe("validation", () => {
    it("shows both error messages when Continue is clicked without selecting countries", async () => {
      const wrapper = await mountStep();
      await clickContinue(wrapper);
      const citizenship = wrapper.find(
        '[data-testid="country-select-citizenship"]',
      );
      const destination = wrapper.find(
        '[data-testid="country-select-destination"]',
      );
      expect(citizenship.attributes("data-error")).toBe(
        "Citizenship is required",
      );
      expect(destination.attributes("data-error")).toBe(
        "Destination is required",
      );
    });

    it("shows only destination error when only citizenship is selected", async () => {
      const wrapper = await mountStep();
      await selectCitizenship(wrapper);
      await clickContinue(wrapper);
      const citizenship = wrapper.find(
        '[data-testid="country-select-citizenship"]',
      );
      const destination = wrapper.find(
        '[data-testid="country-select-destination"]',
      );
      expect(citizenship.attributes("data-error")).toBe("");
      expect(destination.attributes("data-error")).toBe(
        "Destination is required",
      );
    });

    it("shows only citizenship error when only destination is selected", async () => {
      const wrapper = await mountStep();
      await selectDestination(wrapper);
      await clickContinue(wrapper);
      const citizenship = wrapper.find(
        '[data-testid="country-select-citizenship"]',
      );
      const destination = wrapper.find(
        '[data-testid="country-select-destination"]',
      );
      expect(citizenship.attributes("data-error")).toBe(
        "Citizenship is required",
      );
      expect(destination.attributes("data-error")).toBe("");
    });

    it("clears error messages after valid selection is made", async () => {
      const wrapper = await mountStep();
      await clickContinue(wrapper); // trigger errors

      await selectCitizenship(wrapper);
      await selectDestination(wrapper);

      await clickContinue(wrapper); // should clear errors

      const citizenship = wrapper.find(
        '[data-testid="country-select-citizenship"]',
      );
      const destination = wrapper.find(
        '[data-testid="country-select-destination"]',
      );
      expect(citizenship.attributes("data-error")).toBe("");
      expect(destination.attributes("data-error")).toBe("");
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Touched state
  // ---------------------------------------------------------------------------

  describe("touched state", () => {
    it("does not show errors before user interacts", async () => {
      const wrapper = await mountStep();
      // No click, no interaction
      const citizenship = wrapper.find(
        '[data-testid="country-select-citizenship"]',
      );
      expect(citizenship.attributes("data-error")).toBe("");
    });

    it("shows error after update:modelValue is emitted from CountrySelect and Continue is clicked", async () => {
      const wrapper = await mountStep();
      // Simulate user interacting with citizenship then leaving it empty
      await wrapper
        .findAllComponents({ name: "CountrySelectStub" })
        .find((s) => s.props("label") === "Citizenship")
        ?.vm.$emit("update:modelValue", null);

      await wrapper.vm.$nextTick();
      await clickContinue(wrapper);
      const citizenship = wrapper.find(
        '[data-testid="country-select-citizenship"]',
      );
      expect(citizenship.attributes("data-error")).toBe(
        "Citizenship is required",
      );
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Exclude prop — same country restriction
  // ---------------------------------------------------------------------------

  describe("exclude prop", () => {
    it("passes destination as exclude to citizenship CountrySelect", async () => {
      const wrapper = await mountStep();
      await selectDestination(wrapper);
      const citizenship = wrapper.find(
        '[data-testid="country-select-citizenship"]',
      );
      expect(citizenship.attributes("data-exclude")).toBe(mockDestination.id);
    });

    it("passes citizenship as exclude to destination CountrySelect", async () => {
      const wrapper = await mountStep();
      await selectCitizenship(wrapper);
      const destination = wrapper.find(
        '[data-testid="country-select-destination"]',
      );
      expect(destination.attributes("data-exclude")).toBe(mockCitizenship.id);
    });
  });

  // ---------------------------------------------------------------------------
  // 5. Store interaction
  // ---------------------------------------------------------------------------

  describe("store interaction", () => {
    it("calls wizardStore.updateData with correct data on valid submission", async () => {
      const wrapper = await mountStep();
      await selectCitizenship(wrapper);
      await selectDestination(wrapper);
      await clickContinue(wrapper);
      expect(mockUpdateData).toHaveBeenCalledWith(
        expect.objectContaining({
          citizenship: mockCitizenship,
          destination: mockDestination,
        }),
      );
    });

    it("emits next event on valid submission", async () => {
      const wrapper = await mountStep();
      await selectCitizenship(wrapper);
      await selectDestination(wrapper);
      await clickContinue(wrapper);
      expect(wrapper.emitted("next")).toBeTruthy();
    });

    it("does not call wizardStore.updateData when validation fails", async () => {
      const wrapper = await mountStep();
      await clickContinue(wrapper);
      expect(mockUpdateData).not.toHaveBeenCalled();
    });

    it("does not emit next event when validation fails", async () => {
      const wrapper = await mountStep();
      await clickContinue(wrapper);
      expect(wrapper.emitted("next")).toBeFalsy();
    });
  });

  // ---------------------------------------------------------------------------
  // 6. Store hydration
  // ---------------------------------------------------------------------------

  describe("store hydration", () => {
    it("pre-populates citizenship field from store", async () => {
      mockStoreData = { citizenship: mockCitizenship, destination: null };
      const wrapper = await mountStep();
      // Route preview should not show since destination is missing
      expect(wrapper.text()).not.toContain("Route Validated");
      // But submitting should not show citizenship error
      await clickContinue(wrapper);
      const citizenship = wrapper.find(
        '[data-testid="country-select-citizenship"]',
      );
      expect(citizenship.attributes("data-error")).toBe("");
    });

    it("pre-populates destination field from store", async () => {
      mockStoreData = { citizenship: null, destination: mockDestination };
      const wrapper = await mountStep();
      await clickContinue(wrapper);
      const destination = wrapper.find(
        '[data-testid="country-select-destination"]',
      );
      expect(destination.attributes("data-error")).toBe("");
    });

    it("shows route preview when both fields are pre-populated from store", async () => {
      mockStoreData = {
        citizenship: mockCitizenship,
        destination: mockDestination,
      };
      const wrapper = await mountStep();
      expect(wrapper.text()).toContain("Route Validated");
    });
  });

  // ---------------------------------------------------------------------------
  // 7. Route preview
  // ---------------------------------------------------------------------------

  describe("route preview", () => {
    it("is hidden when neither country is selected", async () => {
      const wrapper = await mountStep();
      expect(wrapper.text()).not.toContain("Route Validated");
    });

    it("is hidden when only citizenship is selected", async () => {
      const wrapper = await mountStep();
      await selectCitizenship(wrapper);
      expect(wrapper.text()).not.toContain("Route Validated");
    });

    it("is hidden when only destination is selected", async () => {
      const wrapper = await mountStep();
      await selectDestination(wrapper);
      expect(wrapper.text()).not.toContain("Route Validated");
    });

    it("is visible when both countries are selected", async () => {
      const wrapper = await mountStep();
      await selectCitizenship(wrapper);
      await selectDestination(wrapper);
      expect(wrapper.text()).toContain("Route Validated");
    });

    it("shows correct country names in route preview", async () => {
      const wrapper = await mountStep();
      await selectCitizenship(wrapper);
      await selectDestination(wrapper);
      expect(wrapper.text()).toContain("United States");
      expect(wrapper.text()).toContain("France");
    });
  });
});
