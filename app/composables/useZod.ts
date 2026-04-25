import { reactive, ref } from "vue";
import { z } from "zod";

export function useZodForm<
  D extends Record<string | number, any>,
  T extends z.ZodRawShape,
>(schema: z.ZodObject<T>, initialState: D) {
  const data = reactive({ ...initialState });
  const errors = ref<Record<string, string>>({});

  // Track which fields the user has interacted with
  const touched = reactive<Record<string, boolean>>({});

  // Main validation (used on form submit)
  const validate = (options = { touchAll: true }) => {
    if (options.touchAll) {
      // If submitting, mark all fields as touched so all errors show
      Object.keys(data).forEach((key) => {
        touched[key] = true;
      });
    }

    const result = schema.safeParse(data);
    if (!result.success) {
      errors.value = result.error.flatten().fieldErrors as any;
      return false;
    }

    errors.value = {};
    return true;
  };

  // Validate on the fly when a specific field changes
  const validateField = (field: keyof typeof data) => {
    touched[field as string] = true;
    validate({ touchAll: false }); // Validate quietly without touching everything else
  };

  return { data, errors, touched, validate, validateField };
}
