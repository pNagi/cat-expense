import { useCallback } from "react";

import { submitExpenseDetail } from "../api/expense/actions";
import { ExpenseDetail } from "../api/expense/schema";
import { ActionResponse } from "../api/expense/types";
import { useExpense } from "../api/expense/useExpense";

export function useAddExpenseDetailForm({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const expense = useExpense();
  const onSubmit = useCallback(
    async (
      prevState: ActionResponse<ExpenseDetail> | null,
      formData: FormData,
    ) => {
      const result = await submitExpenseDetail(prevState, formData);

      if (result.success) {
        await expense.refetch();
        onSuccess();
      }

      return result;
    },
    [onSuccess, expense],
  );

  return { onSubmit };
}
