import { use, useEffect, useRef, useState } from "react";
import { Timer } from "~/components/ui/timer";
import { Button } from "~/components/ui/button";
import type { Route } from "../+types/root";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import IeltsSheet from "~/components/IeltsSheet";
import useIeltsSheet from "hooks/useIeltsSheet";
import TitleInput from "~/components/ui/title-input";
import useCreateSheet from "hooks/useCreateSheet";
import type { ieltsAnswerSheets } from "types/ielts-answer-sheets";
import type { ieltsAnswerSheet } from "types/ielts-answer-sheet";

export type createFormData = ieltsAnswerSheet & Pick<ieltsAnswerSheets, "title">;

const IeltsSheetCreate = () => {
  const {
    numberInputs,
    handleNumberKeyDown,
    selectedMarkers,
    handleMarkerChange,
    listeningTotal,
  } = useIeltsSheet();

  // const { handleCreate } = useCreateSheet();

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<createFormData>();

  const sheetType = watch("type") 

  const onSubmit: SubmitHandler<createFormData> = (data) =>
    console.log(data);

  return (
    <form className="my-4 mb-20" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center items-center">
        <TitleInput label="title" register={register} required />
      </div>

      <div className="flex flex-col justify-end items-end mr-40 my-4">
        <span>Version 1</span>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 mb-8 text-3xl">
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select sheet type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="mock">Mock</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        />
        {sheetType === "mock" && <Timer />}
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white">
        <IeltsSheet
          numberInputs={numberInputs}
          handleNumberKeyDown={handleNumberKeyDown}
          selectedMarkers={selectedMarkers}
          handleMarkerChange={handleMarkerChange}
          listeningTotal={listeningTotal}
          register={register}
        />
      </div>
        <div className="mt-4 mr-56 flex justify-end">
          <Button>Save</Button>
        </div>
    </form>
  );
};

export default IeltsSheetCreate;
