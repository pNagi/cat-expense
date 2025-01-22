import { useActionState, useCallback } from "react";

import { submitDeleteExpenseDetails } from "../api/expense/actions";
import { BaseActionReseponse } from "../api/expense/types";
import { useExpense } from "../api/expense/useExpense";

export function useDeleteExpenseDetailForm() {
  const expense = useExpense();
  const onSubmit = useCallback(
    async (prevState: BaseActionReseponse | null, formData: FormData) => {
      const result = await submitDeleteExpenseDetails(prevState, formData);

      if (result.success) {
        await expense.refetch();
      }

      return result;
    },
    [expense],
  );

  const [state, action, isPending] = useActionState(onSubmit, {
    success: false,
  });

  return { state, action, isPending };
}
