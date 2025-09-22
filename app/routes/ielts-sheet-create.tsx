import { Timer } from "~/components/ui/timer";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Controller } from "react-hook-form";
import IeltsSheet from "~/components/IeltsSheet";
import TitleInput from "~/components/ui/title-input";
import { useIeltsSheetCreateContext } from "context/ielts-sheet-create-context";

const IeltsSheetCreate = () => {
  const { handleSubmit, onSubmit, control, sheetType } =
    useIeltsSheetCreateContext();

  return (
    <form className="my-4 mb-20" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex justify-center items-center">
        <TitleInput label="title" required />
      </div>

      <div className="flex flex-col justify-end items-end mr-40 my-4">
        <span>Version 1</span>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 mb-8 text-3xl">
        <Controller
          name="type"
          control={control}
          rules={{ required: "Sheet type is required" }}
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
        <IeltsSheet />
      </div>
      <div className="mt-4 mr-56 flex justify-end">
        <Button>Save</Button>
      </div>
    </form>
  );
};

export default IeltsSheetCreate;
