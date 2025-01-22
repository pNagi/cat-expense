import { submitExpenseDetail } from "../api/expense/actions";
import { ExpenseDetailForm } from "../components/ExpenseDetailForm";

export function ExpensePage() {
  return (
    <>
      <ExpenseDetailForm className="w-80" onSubmit={submitExpenseDetail} />
    </>
  );
}
