import useCreateSheet from "hooks/useCreateSheet";
import { createContext, use } from "react";

// Create context with correct type
const IeltsSheetCreateContext = createContext<ReturnType<typeof useCreateSheet> | null>(null);

// Custom hook to consume the context
export const useIeltsSheetCreateContext = () => {
  const context = use(IeltsSheetCreateContext);
  if (!context) {
    throw new Error("useCreate must be used within an IeltsSheetCreateProvider");
  }
  return context;
};

// Provider component
export const IeltsSheetCreateProvider = ({ children }: { children: React.ReactNode }) => {
  const data = useCreateSheet();

  return (
    <IeltsSheetCreateContext value={data}>
      {children}
    </IeltsSheetCreateContext>
  );
};
