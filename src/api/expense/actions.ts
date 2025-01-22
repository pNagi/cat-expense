import { intentionallyDelay } from "../../utils/delay";
import { ExpenseDetail } from "./schema";
import { deleteExpenseDetails, saveExpenseDetail } from "./storage";
import { ActionResponse, BaseActionReseponse } from "./types";
import { validateExpenseDetail } from "./validator";

export async function submitDeleteExpenseDetails(
  _: BaseActionReseponse | null,
  formData: FormData,
): Promise<BaseActionReseponse> {
  const ids = formData.getAll("ids").map(Number);

  if (!ids.length) {
    return { success: false };
  }

  try {
    deleteExpenseDetails(ids);
    await intentionallyDelay(); // Simulate network delay

    return { success: true };
  } catch (error) {
    // IMPROVEMENT: Change console.error to proper log
    console.error(error);

    return { success: false };
  }
}

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
