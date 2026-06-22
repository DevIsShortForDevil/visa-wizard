// =============================================================================
// useZodForm — Unit Tests
// =============================================================================
//
// Test plan:
//
// 1. INITIAL STATE
//    - data matches initialState on mount
//    - errors is empty on mount
//    - touched is empty on mount
//
// 2. validate()
//    - returns false and populates errors when data is invalid
//    - returns true and clears errors when data is valid
//    - marks all fields as touched when touchAll is true (default)
//    - does not mark untouched fields as touched when touchAll is false
//    - clears errors when previously invalid data becomes valid
//
// 3. validateField()
//    - marks the field as touched IMMEDIATELY, before debounce fires
//      (touched is set outside the debounce intentionally — this test
//       verifies that architectural decision is working correctly)
//    - only updates the error for the specific field, not others
//    - clears the error when the field becomes valid
//    - debounces rapid calls and only fires once after 300ms
//    - handles a field not in the schema gracefully without throwing errors
//
// 4. getError()
//    - returns empty string for untouched field even if data is invalid
//      (errors should not surface before the user has interacted)
//    - returns error message for touched invalid field
//    - returns empty string for touched valid field
//    - returns only the first error message when multiple validators fail
//
// 5. reset()
//    - restores data to initialState
//    - clears all errors
//    - resets touched state to false for all fields
//    - getError returns empty for all fields after reset
//    - validate behaves as a fresh form after reset — no lingering state
//
// -----------------------------------------------------------------------------
// Notes on test setup:
//
// - vi.useFakeTimers() is used to control debounce without waiting 300ms
//   Call vi.advanceTimersByTime(300) after validateField() to flush the debounce
//
// - debounce is mocked via vi.mock('#imports') since Nuxt auto-imports are
//   not available in the plain Node test environment
// =============================================================================

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { z } from "zod";

// We need to stub the auto-imported `debounce` utility since it lives in app/utils
// and is not available in the plain Node test environment
vi.mock("@/utils/debounce", () => ({
  debounce: (fn: (...args: unknown[]) => void, delay: number) => {
    // Return a debounced version using setTimeout so fake timers can control it
    let timer: ReturnType<typeof setTimeout>;
    return (...args: unknown[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },
  reactive: import("vue").reactive,
  ref: import("vue").ref,
  readonly: import("vue").readonly,
  computed: import("vue").computed,
}));

// Import after mocking so the composable picks up the stubbed debounce
import { useZodForm } from "../../app/composables/useZodForm";

// --- Shared test schema and initial state ---
const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
});

const initialState = {
  name: "",
  email: "",
};

describe("useZodForm", () => {
  // Use fake timers to control debounce without actually waiting 300ms
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // -------------------------------------------------------------------------
  // Initial state
  // -------------------------------------------------------------------------

  describe("initial state", () => {
    // data should be a reactive copy of initialState
    it("data matches initialState", () => {
      const { data } = useZodForm(schema, initialState);
      expect(data.name).toBe("");
      expect(data.email).toBe("");
    });

    // errors should be empty on mount — no validation has run yet
    it("errors is empty on mount", () => {
      const { errors } = useZodForm(schema, initialState);
      expect(errors.value).toEqual({});
    });

    // no field should be touched on mount
    it("touched is empty on mount", () => {
      const { touched } = useZodForm(schema, initialState);
      expect(Object.values(touched).every((v) => v === false)).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // validate()
  // -------------------------------------------------------------------------

  describe("validate()", () => {
    // Invalid data should return false and populate errors
    it("returns false and populates errors when data is invalid", () => {
      const { validate, errors } = useZodForm(schema, initialState);
      const result = validate();
      expect(result).toBe(false);
      expect(errors.value.name).toBe("Name is required");
      expect(errors.value.email).toBe("Invalid email");
    });

    // Valid data should return true and clear errors
    it("returns true and clears errors when data is valid", () => {
      const { data, validate, errors } = useZodForm(schema, initialState);
      data.name = "John Snow";
      data.email = "bastard@got.com";
      const result = validate();
      expect(result).toBe(true);
      expect(errors.value).toEqual({});
    });

    // touchAll: true (default) should mark all fields as touched
    it("marks all fields as touched when touchAll is true", () => {
      const { validate, touched } = useZodForm(schema, initialState);
      validate({ touchAll: true });
      expect(touched.name).toBe(true);
      expect(touched.email).toBe(true);
    });

    // touchAll: false should validate without touching untouched fields
    it("does not mark untouched fields as touched when touchAll is false", () => {
      const { validate, touched } = useZodForm(schema, initialState);
      validate({ touchAll: false });
      expect(touched.name).toBeFalsy();
      expect(touched.email).toBeFalsy();
    });

    // errors should clear when previously invalid data becomes valid
    it("clears errors when previously invalid data becomes valid", () => {
      const { data, validate, errors } = useZodForm(schema, initialState);
      validate(); // populates errors
      expect(errors.value.name).toBe("Name is required");

      data.name = "John Snow";
      data.email = "bastard@got.com";
      validate();
      expect(errors.value).toEqual({});
    });
  });

  // -------------------------------------------------------------------------
  // validateField()
  // -------------------------------------------------------------------------

  describe("validateField()", () => {
    // touched should be set immediately, before the debounce resolves
    it("marks the field as touched immediately, before debounce fires", () => {
      const { validateField, touched } = useZodForm(schema, initialState);
      validateField("name");
      // touched must be true right away — not after 300ms
      expect(touched.name).toBe(true);
      expect(touched.email).toBeFalsy();
    });

    // only the validated field's error should be updated
    it("only updates the error for the specific field", () => {
      const { validateField, errors } = useZodForm(schema, initialState);
      validateField("name");
      vi.advanceTimersByTime(300);
      expect(errors.value.name).toBe("Name is required");
      // email error should not appear since we only validated name
      expect(errors.value.email).toBeUndefined();
    });

    // when a field becomes valid, its error should be cleared
    it("clears the error when the field becomes valid", () => {
      const { data, validateField, errors } = useZodForm(schema, initialState);

      // first make it invalid
      validateField("name");
      vi.advanceTimersByTime(300);
      expect(errors.value.name).toBe("Name is required");

      // now fix the field and validate again
      data.name = "John Snow";
      validateField("name");
      vi.advanceTimersByTime(300);
      expect(errors.value.name).toBeUndefined();
    });

    // rapid calls should only fire once after 300ms — debounce is working
    it("debounces rapid calls and only fires once after 300ms", () => {
      const { data, validateField, errors } = useZodForm(schema, initialState);

      // call rapidly multiple times
      validateField("name");
      validateField("name");
      validateField("name");

      // nothing should have fired yet
      expect(errors.value.name).toBeUndefined();

      // advance time — should only have fired once
      vi.advanceTimersByTime(300);
      expect(errors.value.name).toBe("Name is required");
    });

    // non-existent field should not throw
    it("handles a field not in the schema gracefully", () => {
      const { validateField } = useZodForm(schema, initialState);
      expect(() => {
        validateField("nonExistent");
        vi.advanceTimersByTime(300);
      }).not.toThrow();
    });
  });

  // -------------------------------------------------------------------------
  // getError()
  // -------------------------------------------------------------------------

  describe("getError()", () => {
    // untouched field should always return empty string regardless of validity
    it("returns empty string for untouched field even if invalid", () => {
      const { getError } = useZodForm(schema, initialState);
      expect(getError("name")).toBe("");
    });

    // touched field with error should return the error message
    it("returns error message for touched invalid field", () => {
      const { validateField, getError } = useZodForm(schema, initialState);
      validateField("name");
      vi.advanceTimersByTime(300);
      expect(getError("name")).toBe("Name is required");
    });

    // touched field with no error should return empty string
    it("returns empty string for touched valid field", () => {
      const { data, validateField, getError } = useZodForm(
        schema,
        initialState,
      );
      data.name = "John Snow";
      validateField("name");
      vi.advanceTimersByTime(300);
      expect(getError("name")).toBe("");
    });

    // should return only the first error message, not multiple
    it("returns only the first error message", () => {
      const multiErrorSchema = z.object({
        password: z
          .string()
          .min(8, "Too short")
          .regex(/[A-Z]/, "Must have uppercase"),
      });
      const { validateField, getError } = useZodForm(multiErrorSchema, {
        password: "",
      });
      validateField("password");
      vi.advanceTimersByTime(300);
      // should only return the first error, not both
      expect(getError("password")).toBe("Too short");
    });
  });

  // -------------------------------------------------------------------------
  // reset()
  // -------------------------------------------------------------------------

  describe("reset()", () => {
    // data should be restored to initialState after reset
    it("restores data to initialState", () => {
      const { data, reset } = useZodForm(schema, initialState);
      data.name = "John Snow";
      data.email = "bastard@got.com";
      reset();
      expect(data.name).toBe("");
      expect(data.email).toBe("");
    });

    // errors should be cleared after reset
    it("clears all errors", () => {
      const { validate, reset, errors } = useZodForm(schema, initialState);
      validate();
      expect(Object.keys(errors.value).length).toBeGreaterThan(0);
      reset();
      expect(errors.value).toEqual({});
    });

    // touched should be reset to false for all fields
    it("resets touched state for all fields", () => {
      const { validate, reset, touched } = useZodForm(schema, initialState);
      validate({ touchAll: true });
      expect(touched.name).toBe(true);
      reset();
      expect(touched.name).toBe(false);
      expect(touched.email).toBe(false);
    });

    // after reset, getError should return empty for all fields
    it("getError returns empty for all fields after reset", () => {
      const { validate, reset, getError } = useZodForm(schema, initialState);
      validate({ touchAll: true });
      reset();
      expect(getError("name")).toBe("");
      expect(getError("email")).toBe("");
    });

    // after reset, validate should behave as fresh form
    it("validate behaves as a fresh form after reset", () => {
      const { data, validate, reset } = useZodForm(schema, initialState);
      data.name = "John Snow";
      data.email = "bastard@got.com";
      validate();
      reset();
      // data is back to invalid state, validate should return false
      const result = validate();
      expect(result).toBe(false);
    });
  });
});
