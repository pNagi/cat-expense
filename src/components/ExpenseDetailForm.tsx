import { useActionState } from "react";

import { CategoryId, ExpenseDetail } from "../api/expense/schema";
import { ActionResponse } from "../api/expense/types";
import { t } from "../translations";
import { FormElement } from "../ui-kit/FormElement";
import { SubmitButton } from "../ui-kit/SubmitButton";

/**
 * IMPROVEMENT:
 * - After submit validation, autofocus first error field
 * - After unfocus a field, run validation on that field
 */

interface ExpenseDetailFormProps {
  className?: string;
  onSubmit: (
    state: Awaited<ActionResponse<ExpenseDetail>>,
    payload: FormData,
  ) => ActionResponse<ExpenseDetail> | Promise<ActionResponse<ExpenseDetail>>;
}

export function ExpenseDetailForm({
  className,
  onSubmit,
}: ExpenseDetailFormProps) {
  const [state, action, isPending] = useActionState(onSubmit, {
    success: false,
  });

  return (
    <form className={className} action={action}>
      {/* Item Input */}
      <FormElement
        inputType="input"
        inputProps={{
          name: "item",
          placeholder: t.expenseDetail.item.placeholder,
          defaultValue: state.data?.item,
        }}
        label={t.expenseDetail.item.label}
        errors={state.errors?.item}
      />
      {/* Select Input */}
      <FormElement
        inputType="select"
        inputProps={{
          name: "categoryId",
          defaultValue: state.data?.categoryId ?? CategoryId.Food,
        }}
        label={t.expenseDetail.category.label}
        errors={state.errors?.categoryId}
      >
        {Object.values(CategoryId).map((categoryId) => (
          <option key={categoryId} value={categoryId}>
            {t.categories[categoryId]}
          </option>
        ))}
      </FormElement>
      {/* Amount Input */}
      <FormElement
        inputType="input"
        inputProps={{
          name: "amount",
          placeholder: t.expenseDetail.amount.placeholder,
          defaultValue: state.data?.amount,
          inputMode: "decimal",
        }}
        label={t.expenseDetail.amount.label}
        errors={state.errors?.amount}
      />
      {/* Submit Button */}
      <SubmitButton
        className="btn-primary mt-6 w-full"
        text={t.submitButton.text}
        pendingText={t.submitButton.pendingText}
        isPending={isPending}
      />
    </form>
  );
}
