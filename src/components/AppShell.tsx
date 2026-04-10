"use client";

import { useEffect, useState } from "react";
import { SearchContext } from "../contexts/search";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");

  // Clear search when navigating between pages; might need to just keep this in dashboard.
  useEffect(() => {
    setQuery("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SearchContext.Provider value={{ query, setQuery }}>
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </SearchContext.Provider>
  );
}
