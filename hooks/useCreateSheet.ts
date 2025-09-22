import { useForm, type SubmitHandler } from "react-hook-form";
import type { ieltsAnswerSheet } from "types/ielts-answer-sheet";
import type { ieltsAnswerSheets } from "types/ielts-answer-sheets";
import useIeltsSheet from "./useIeltsSheet";
import { checkIfSheetExists } from "~/lib/drive";
import {
  createNewSheet,
  hasSheetWithName,
  renameFirstSheet,
} from "~/lib/spreadsheet";
import { toast } from "sonner";

export type createFormData = ieltsAnswerSheet &
  Pick<ieltsAnswerSheets, "title">;

export default function useCreateSheet() {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<createFormData>({
    defaultValues: {
      title: "",
      type: "exercise",
      version: 1,
      totalScore: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      answers: Array.from({ length: 40 }).map(() => ({
        response: "",
        isCorrect: false,
      })),
    },
  });

  const {
    numberInputs,
    handleNumberKeyDown,
    selectedMarkers,
    handleMarkerChange,
    pointTotal,
  } = useIeltsSheet(setValue);

  const sheetType = watch("type");

  const onSubmit: SubmitHandler<createFormData> = async (data) => {
    const fileName = "Ielts Note";
    let existingFile = await checkIfSheetExists(fileName);

    if (!existingFile) {
      const response = await gapi.client.sheets.spreadsheets.create({
        resource: {
          properties: {
            title: fileName,
          },
        },
      });
      existingFile = response.result;
    }

    if (!existingFile || !existingFile.spreadsheetId) {
      console.error("Failed to create or retrieve the spreadsheet.");
      return;
    }

    if (!(await hasSheetWithName(existingFile.spreadsheetId, data.title))) {
      //create new sheet
      //if just the first sheet, rename it
      renameFirstSheet(existingFile, data.title);
    } else {
      createNewSheet(existingFile, data.title);
    }
    //write


    toast.success("Sheet created successfully!");
  };

  return {
    register,
    handleSubmit,
    onSubmit,
    control,
    errors,
    sheetType,
    numberInputs,
    handleNumberKeyDown,
    selectedMarkers,
    handleMarkerChange,
    pointTotal,
  };
}
