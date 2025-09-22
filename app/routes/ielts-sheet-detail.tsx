import { useState } from "react";
import IeltsSheet from "~/components/IeltsSheet";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Timer } from "~/components/ui/timer";
import TitleInput from "~/components/ui/title-input";

export default function IeltsSheetDetail() {
  const [type, setType] = useState<"mock" | "exercise">("exercise");
  const [mode, setMode] = useState<'edit' | 'view'>('view')
  return (
    <form>
      <div className="flex justify-center items-center">
        <TitleInput label="title" mode={mode} value="test 1"/>
      </div>

      <div className="flex justify-end items-end mr-40 my-4 gap-8">
        <Select defaultValue="1">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select sheet type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="1">{`Version ${1}`}</SelectItem>
              <SelectItem value="2">{`Version ${2}`}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button>Add new version</Button>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 mb-8 text-3xl">
        <Select value={type} onValueChange={(value) => setType(value as "mock" | "exercise")} disabled>
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
        {type === "mock" && <Timer />}
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white">
        <IeltsSheet mode={mode}/>
      </div>
      <div className="mt-4 mr-56 flex justify-end">
        {mode === "edit" && <Button>Save</Button>}
      </div>
    </form>
  );
}
