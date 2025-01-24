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
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const badgeColors = {
  [CategoryId.Food]: ["badge-primary", "text-primary-800"],
  [CategoryId.Furniture]: ["badge-secondary", "text-secondary-800"],
  [CategoryId.Accessory]: ["badge-warning", "text-yellow-800"],
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
      all: !!expenseDetails.length && state.size === expenseDetails.length,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expenseDetails.length]);

  return (
    <>
      <table className="table w-full table-fixed">
        <thead className="bg-zinc-100">
          <tr>
            <th className="w-14 max-w-fit">
              <label>
                <input
                  className="checkbox bg-white"
                  type="checkbox"
                  name="all"
                  checked={state.all}
                  onChange={toggleAll}
                />
              </label>
            </th>
            <th className="w-3/6">
              <span>{t.expenseDetail.item.label}</span>
            </th>
            <th className="w-1/6">{t.expenseDetail.category.label}</th>
            <th className="w-2/6 text-right">{t.expenseDetail.amount.label}</th>
            <th className="w-16"></th>
          </tr>
        </thead>
        <tbody>
          {expenseDetails.map(({ id, item, categoryId, amount }) => (
            <tr
              key={id}
              className={twMerge(
                ["hover:bg-orange-50"],
                topCategoryId === categoryId && ["bg-yellow-50"],
              )}
            >
              <th>
                <label>
                  <input
                    type="checkbox"
                    className="checkbox bg-white"
                    name="ids"
                    value={id}
                    checked={!!state.checked[id]}
                    onChange={toggleItem(id)}
                  />
                </label>
              </th>
              <td>{item}</td>
              <td>
                <span className={twMerge("badge", badgeColors[categoryId])}>
                  {t.categories[categoryId]}
                </span>
              </td>
              <td className={"text-right"}>{formatter.format(amount)}</td>
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
    </>
  );
}
