import { convertEntryValueToString } from "../../utils/formData";
import {
  amountSchema,
  categoryIdSchema,
  expenseDetailSchema,
  itemSchema,
} from "./schema";

// FUTURE: To use for unfocus validation
export function validateAmount(value?: FormDataEntryValue | null) {
  return amountSchema
    .safeParse(convertEntryValueToString(value))
    .error?.flatten().formErrors;
}

// FUTURE: To use for unfocus validation
export function validateCategoryId(value?: FormDataEntryValue | null) {
  return categoryIdSchema
    .safeParse(convertEntryValueToString(value))
    .error?.flatten().formErrors;
}

export function validateExpenseDetail(formData: FormData) {
  const data = {
    item: convertEntryValueToString(formData.get("item")),
    categoryId: convertEntryValueToString(formData.get("categoryId")),
    amount: convertEntryValueToString(formData.get("amount")),
  };

  const validatedData = expenseDetailSchema.omit({ id: true }).safeParse(data);

  return { data, validatedData };
}

// FUTURE: To use for unfocus validation
export function validateItem(value?: FormDataEntryValue | null) {
  return itemSchema.safeParse(convertEntryValueToString(value)).error?.flatten()
    .formErrors;
}
