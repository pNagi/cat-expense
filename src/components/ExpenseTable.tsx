import { useCallback, useEffect, useMemo, useState } from "react";

import { Expense } from "../api/expense/schema";
import { t } from "../translations";

interface ExpenseTableProps
  extends Pick<Expense, "expenseDetails" | "maxAmount" | "maxCategoryAmount"> {
  isLoading: boolean;
}

interface State {
  all: boolean;
  checked: Record<number, boolean>;
  size: number;
}

const initialState = {
  all: false,
  checked: {},
  size: 0,
};

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function ExpenseTable({
  expenseDetails,
  maxCategoryAmount,
  maxAmount,
  isLoading,
}: ExpenseTableProps) {
  const [state, setState] = useState<State>(initialState);

  const allFormState = useMemo(
    // Cache 'all' form state
    () => ({
      all: true,
      checked: expenseDetails.reduce(
        (acc, d) => ({ ...acc, [d.id]: true }),
        {},
      ),
      size: expenseDetails.length,
    }),
    [expenseDetails],
  );

  const toggleItem = useCallback(
    (id: number) => () => {
      if (state.checked[id]) {
        // Remove 'all' when uncheck
        setState({
          all: false,
          checked: { ...state.checked, [id]: false },
          size: state.size - 1,
        });
      } else {
        // Recalculate 'all' when check
        setState({
          all: state.size + 1 === expenseDetails.length,
          checked: { ...state.checked, [id]: true },
          size: state.size + 1,
        });
      }
    },
    [expenseDetails.length, state.checked, state.size],
  );

  const toggleAll = useCallback(() => {
    if (state.all) setState(initialState);
    else setState(allFormState);
  }, [allFormState, state.all]);

  useEffect(() => {
    // Recalculate 'all' when new expense detail is added
    setState({
      ...state,
      all: state.size === expenseDetails.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseDetails.length]);

  return (
    <table className="table min-h-96 w-full">
      <thead>
        <tr>
          <th>
            <label>
              <input
                className="checkbox"
                type="checkbox"
                name="all"
                checked={state.all}
                onChange={toggleAll}
              />
            </label>
          </th>
          <th>{t.expenseDetail.item.label}</th>
          <th>{t.expenseDetail.category.label}</th>
          <th>{t.expenseDetail.amount.label}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {expenseDetails.map(({ id, item, categoryId, amount }) => (
          <tr key={id} className="hover">
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  name="ids"
                  value={id}
                  checked={!!state.checked[id]}
                  onChange={toggleItem(id)}
                />
              </label>
            </th>
            <td>{item}</td>
            <td>
              <span className="badge badge-ghost">
                {t.categories[categoryId]}
              </span>
            </td>
            <td>{formatter.format(amount)}</td>
            <td>
              {maxAmount === amount ? (
                <span className="badge badge-ghost">{t.max}</span>
              ) : null}
              {maxCategoryAmount[categoryId] === amount ? (
                <span className="badge badge-ghost">
                  {t.maxCategory[categoryId]}
                </span>
              ) : null}
            </td>
          </tr>
        ))}
      </tbody>
      {isLoading ? (
        <div className="absolute inset-0 z-10 flex size-full items-center justify-center bg-white/30 backdrop-blur-sm">
          <span className="loading loading-spinner"></span>
        </div>
      ) : null}
    </table>
  );
}
