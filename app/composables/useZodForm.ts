import { reactive, ref } from "vue";
import { z } from "zod";
import { debounce } from "@/utils/debounce";

export function useZodForm<
  D extends Record<string | number, any>, // Schema shape type
  T extends z.ZodRawShape, // Initial state type
>(schema: z.ZodObject<T>, initialState: D) {
  const data = reactive({ ...initialState });
  const errors = ref<Record<string, string>>({});
  const touched = reactive<Record<string, boolean>>({});

  // Main validation (used on form submit)
  const validate = (options = { touchAll: true }) => {
    if (options.touchAll) {
      Object.keys(data).forEach((key) => {
        touched[key] = true;
      });
    }

    const result = schema.safeParse(data);
    if (!result.success) {
      // Flatten the Zod error to get field-specific errors
      const { fieldErrors } = z.flattenError(result.error);
      const newErrors: Record<string, string> = {};
      for (const key in fieldErrors) {
        const msgs = fieldErrors[key];
        if (msgs && msgs.length > 0) {
          newErrors[key] = msgs[0] ?? "";
        }
      }
      errors.value = newErrors;
      return false;
    }

    errors.value = {};
    return true;
  };

  const validateField = (field: string) => {
    // Mark the field as touched outside of the debounce so it happens immediately.
    touched[field] = true;
    debouncedValidateField(field);
  };

  // Validate on the fly when a specific field changes
  const debouncedValidateField = debounce((field: string) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      const { fieldErrors } = z.flattenError(result.error);
      const typedFieldErrors = fieldErrors as Record<
        string,
        string[] | undefined
      >;
      const msgs = typedFieldErrors[field];

      if (msgs && msgs.length > 0) {
        errors.value[field] = msgs[0] ?? "";
      } else {
        delete errors.value[field];
      }
      return;
    }
    errors.value = {};
  }, 300);

  const getError = (field: string) => {
    if (!touched[field]) return "";
    return errors.value[field] ?? "";
  };

  const reset = () => {
    Object.assign(data, initialState);
    errors.value = {};
    Object.keys(touched).forEach((key) => {
      touched[key] = false;
    });
  };

  return { data, errors, getError, touched, validate, validateField, reset };
}
