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
import IeltsSheet from "~/components/IeltsSheet";
import useIeltsSheet from "hooks/useIeltsSheet";
import TitleInput from "~/components/ui/title-input";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IELTS NOTES" },
    { name: "description", content: "Webapp to store ielts mock test" },
  ];
}

const IeltsSheetCreate = () => {
  const {
    numberInputs,
    handleNumberKeyDown,
    selectedMarkers,
    handleMarkerChange,
    listeningTotal,
  } = useIeltsSheet();

  

  const handleCreate = () => {};

  return (
    <div className="mt-4">
      {/* Header with logos */}
      <div className="flex justify-center items-center">
        <TitleInput />
      </div>

      <div className="flex flex-col justify-end items-end mr-40 my-4">
        <span>Version 1</span>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 mb-4 text-3xl">
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="apple">Mock</SelectItem>
              <SelectItem value="banana">Exercise</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Timer />
      </div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white">
        <IeltsSheet
          numberInputs={numberInputs}
          handleNumberKeyDown={handleNumberKeyDown}
          selectedMarkers={selectedMarkers}
          handleMarkerChange={handleMarkerChange}
          listeningTotal={listeningTotal}
        />
        <div className="mt-4 flex justify-end">
          <Button onClick={handleCreate}>Save</Button>
        </div>
      </div>
    </div>
  );
};

export default IeltsSheetCreate;
