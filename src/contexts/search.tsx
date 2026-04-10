"use client";

import { createContext, useContext } from "react";

interface SearchCtx {
  query: string;
  setQuery: (q: string) => void;
}

export const SearchContext = createContext<SearchCtx>({
  query: "",
  setQuery: () => {},
});

export function useSearch() {
  return useContext(SearchContext);
}
