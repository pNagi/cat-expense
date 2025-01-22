import { useQuery } from "@tanstack/react-query";

import { QueryKey } from "../constants";
import { instance } from "./instance";
import { CatFact } from "./schema";

export function useCatFact() {
  const query = useQuery({
    queryKey: [QueryKey.CatFactFact],
    queryFn: fetchCatFact,
    staleTime: Infinity,
    gcTime: Infinity,
    // Enable false by default as this endpoint return 'random' result
    // We need to be careful about when to fetch
    enabled: false,
  });

  return query;
}

async function fetchCatFact() {
  const response = await instance.get<CatFact>("/fact");

  return response.data;
}
