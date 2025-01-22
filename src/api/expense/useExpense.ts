import { useQuery } from "@tanstack/react-query";

import { intentionallyDelay } from "../../utils/delay";
import { QueryKey } from "../constants";
import { Expense } from "./schema";
import { getExpense } from "./storage";

export function useExpense() {
  const query = useQuery<Expense | undefined>({
    queryKey: [QueryKey.Expense],
    queryFn: fetchExpense,
  });

  return query;
}

async function fetchExpense(): Promise<Expense | undefined> {
  await intentionallyDelay(); // Simulate network delay

  return getExpense();
}
