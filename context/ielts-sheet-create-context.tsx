import useCreateSheet from "hooks/useCreateSheet";
import { createContext, useContext } from "react";
import { Outlet } from "react-router";

// Create context with correct type
export const IeltsSheetCreateContext = createContext<ReturnType<typeof useCreateSheet> | null>(null);

// Custom hook to consume the context
export const useIeltsSheetCreateContext = () => {
  const context = useContext(IeltsSheetCreateContext);
  if (!context) {
    throw new Error("useCreate must be used within an IeltsSheetCreateProvider");
  }
  return context;
};

