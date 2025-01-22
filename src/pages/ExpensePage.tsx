import { useCallback, useRef, useState } from "react";

import { useCatFact } from "../api/cat-fact/useCatFact";
import { useExpense } from "../api/expense/useExpense";
import { ExpenseDetailForm } from "../components/ExpenseDetailForm";
import { ExpenseTable } from "../components/ExpenseTable";
import { useAddExpenseDetailForm } from "../hooks/useAddExpenseDetailForm";
import { t } from "../translations";
import { Modal } from "../ui-kit/Modal";
import { ModalCloseButton } from "../ui-kit/ModalCloseButton";

export function ExpensePage() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const catFact = useCatFact();
  const expense = useExpense();

  const [formId, setFormId] = useState<number>(0);

  const showModal = useCallback(() => {
    void catFact.refetch();
    modalRef.current?.showModal();
  }, [catFact]);

  const closeModal = useCallback(() => {
    modalRef.current?.close();
    setFormId(formId + 1);
  }, [formId]);

  const addForm = useAddExpenseDetailForm({ onSuccess: closeModal });

  return (
    <>
      {/* Modal */}
      <Modal ref={modalRef}>
        {/* First element in a dialog will be auto-focused when dialog is opened */}
        <div className="flex w-full flex-col items-center lg:flex-row">
          {/* Left Section */}
          <ExpenseDetailForm
            key={formId}
            className="w-full basis-3/5"
            onSubmit={addForm.onSubmit}
          />
          {/* Divider */}
          <div className="divider lg:divider-horizontal"></div>
          {/* Right Section */}
          <div className="w-full basis-2/5 place-items-center">
            {catFact.isFetching ? (
              <span className="loading loading-spinner loading-lg"></span>
            ) : (
              <span>
                {catFact.data?.fact ?? t.errors.somethingWentWrong.text}
              </span>
            )}
          </div>
        </div>
        {/* Close Button */}
        <ModalCloseButton onClick={closeModal} />
      </Modal>
      {/* Add Button */}
      <button className="btn btn-primary" type="button" onClick={showModal}>
        {t.addButton.text}
      </button>
      {/* Table */}
      <ExpenseTable
        expenseDetails={expense.data?.expenseDetails ?? []}
        maxCategoryAmount={expense.data?.maxCategoryAmount ?? {}}
        maxAmount={expense.data?.maxAmount ?? 0}
        isLoading={expense.isLoading}
      />
    </>
  );
}
