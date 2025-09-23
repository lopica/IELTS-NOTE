import useCreateSheet from "hooks/useCreateSheet";
import { Outlet } from "react-router";
import {IeltsSheetCreateContext} from "../../context/ielts-sheet-create-context";

// Provider component
export default function IeltsSheetCreateProvider() {
  const data = useCreateSheet();

  return (
    <IeltsSheetCreateContext value={data}>
      <Outlet />
    </IeltsSheetCreateContext>
  );
};
