import { useCallback, useEffect, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";

import { CategoryId, Expense } from "../api/expense/schema";
import { t } from "../translations";

interface ExpenseTableProps
  extends Pick<Expense, "expenseDetails" | "topCategoryId"> {
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

const badgeColor = {
  [CategoryId.Food]: "badge-primary",
  [CategoryId.Furniture]: "badge-secondary",
  [CategoryId.Accessory]: "badge-accent",
};

export function ExpenseTable({
  expenseDetails,
  topCategoryId,
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
    <div className="table min-h-96 w-full">
      <table className="table w-full">
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
            <tr
              key={id}
              className={twMerge(
                topCategoryId === categoryId
                  ? ["bg-yellow-50", "hover:bg-yellow-100"]
                  : ["hover:bg-slate-50"],
              )}
            >
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
                <span className={twMerge("badge", badgeColor[categoryId])}>
                  {t.categories[categoryId]}
                </span>
              </td>
              <td>{formatter.format(amount)}</td>
              <td>{topCategoryId === categoryId ? t.max : null}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading ? (
        <div className="absolute inset-0 z-10 flex size-full items-center justify-center bg-white/30 backdrop-blur-sm">
          <span className="loading loading-spinner"></span>
        </div>
      ) : null}
    </div>
  );
}
