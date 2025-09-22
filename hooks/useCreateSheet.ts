import { useForm, type SubmitHandler } from "react-hook-form";
import type { ieltsAnswerSheet } from "types/ielts-answer-sheet";
import type { ieltsAnswerSheets } from "types/ielts-answer-sheets";
import useIeltsSheet from "./useIeltsSheet";
import { checkIfSheetExists } from "~/lib/drive";
import {
  createNewSheet,
  createNewSpreadsheet,
  hasSheetWithName,
} from "~/lib/spreadsheet";
import { toast } from "sonner";
import { useState } from "react";
import { useNavigate } from "react-router";

export type createFormData = ieltsAnswerSheet &
  Pick<ieltsAnswerSheets, "title">;

export default function useCreateSheet() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
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
    if (isSubmitting) {
      toast.error("Please wait, still creating the sheet...");
      return;
    }

    setIsSubmitting(true); 
    toast.loading("Creating sheet...");
    const fileName = "Ielts Note";
    let existingFile
    try {
      existingFile = await checkIfSheetExists(fileName);
    } catch (error) {
      setIsSubmitting(false); 
      toast.dismiss();
      toast.error("Timout error when checking for existing file.");
      navigate(`/`)
      return;
    }

    if (!existingFile) {
      existingFile = await createNewSpreadsheet(fileName);
    }

    if (!existingFile || !existingFile.spreadsheetId) {
      setIsSubmitting(false); 
      toast.dismiss();
      toast.error("Failed to create or retrieve the spreadsheet.");
      return;
    }

    if (await hasSheetWithName(existingFile.spreadsheetId, data.title)) {
      setIsSubmitting(false); 
      toast.dismiss();
      toast.error("This title already exists. Please choose a different title.");
      return;
    }
    
    //create new sheet
   
    try {
      await createNewSheet(existingFile, data.title);
    } catch (error) {
      setIsSubmitting(false); 
      toast.dismiss();
      toast.error("Failed to create a new sheet with the given title.");
      return

    }
    // write
    // write in the title sheet
    
    // write in the summary sheet    


    setIsSubmitting(false); 
    toast.dismiss();
    toast.success("Sheet created successfully!");
    navigate(`/list`)
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
