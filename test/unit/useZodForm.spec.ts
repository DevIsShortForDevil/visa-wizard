import { describe, it, expect } from "vitest";
import { z } from "zod";
import { useZodForm } from "../../app/composables/useZod";

describe("useZodForm", () => {
  // Define a dummy schema and initial state for testing
  const testSchema = z.object({
    username: z.string().min(3, "Username too short"),
    age: z.number().min(18, "Must be an adult"),
  });

  const initialState = {
    username: "",
    age: 0,
  };

  it("initializes with the correct default state", () => {
    const { data, errors, touched } = useZodForm(testSchema, initialState);

    expect(data.username).toBe("");
    expect(data.age).toBe(0);
    expect(errors.value).toEqual({});
    expect(touched).toEqual({});
  });

  it("validate() touches all fields and sets errors on invalid data", () => {
    const { data, errors, touched, validate } = useZodForm(
      testSchema,
      initialState,
    );

    const isValid = validate();

    expect(isValid).toBe(false);
    // All fields should now be touched
    expect(touched.username).toBe(true);
    expect(touched.age).toBe(true);
    // Errors should be populated based on the Zod schema
    expect(errors.value.username[0]).toBe("Username too short");
    expect(errors.value.age[0]).toBe("Must be an adult");
  });

  it("validate() returns true and clears errors on valid data", () => {
    const { data, errors, validate } = useZodForm(testSchema, initialState);

    // Simulate user inputting valid data
    data.username = "JohnDoe";
    data.age = 25;

    const isValid = validate();

    expect(isValid).toBe(true);
    expect(errors.value).toEqual({});
  });

  it("validateField() touches ONLY the specified field and validates quietly", () => {
    const { data, errors, touched, validateField } = useZodForm(
      testSchema,
      initialState,
    );

    // Validate only the username field
    validateField("username");

    // Only username should be marked as touched
    expect(touched.username).toBe(true);
    expect(touched.age).toBeUndefined(); // Age hasn't been touched

    // Errors should still be populated behind the scenes so the UI can check them
    expect(errors.value.username[0]).toBe("Username too short");
    expect(errors.value.age[0]).toBe("Must be an adult");
  });
});
