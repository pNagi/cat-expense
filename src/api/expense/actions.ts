import { intentionallyDelay } from "../../utils/delay";
import { ExpenseDetail } from "./schema";
import { saveExpenseDetail } from "./storage";
import { ActionResponse } from "./types";
import { validateExpenseDetail } from "./validator";

export async function submitExpenseDetail(
  _: ActionResponse<ExpenseDetail> | null,
  formData: FormData,
): Promise<ActionResponse<ExpenseDetail>> {
  const { data, validatedData } = validateExpenseDetail(formData);

  if (!validatedData.success) {
    const errors = validatedData.error.flatten().fieldErrors;

    return { success: false, data, errors };
  }

  try {
    saveExpenseDetail(validatedData.data);
    await intentionallyDelay(); // Simulate network delay

    return { success: true };
  } catch (error) {
    // IMPROVEMENT: Change console.error to proper log
    console.error(error);

    return { success: false, data };
  }
}
