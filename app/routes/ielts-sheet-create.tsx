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



const IeltsSheetCreate = () => {
  const {
    numberInputs,
    handleNumberKeyDown,
    selectedMarkers,
    handleMarkerChange,
    listeningTotal,
  } = useIeltsSheet();

    async function checkIfSheetExists(fileName: string) {
    try {
      const response = await gapi.client.drive.files.list({
        q: `name='${fileName}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
        fields: "files(id, name)",
      });

      const files = response.result.files;
      if (files && files.length > 0) {
        return files[0]; // Hoặc trả về true
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error checking file:", err);
      return null;
    }
  }

  const handleCreate = async () => {
    const fileName = "test";
        const existingFile = await checkIfSheetExists(fileName);

        if (existingFile) {
          console.log("File already exists:", existingFile.id);
          // Optional: mở file, ghi thêm, v.v.
        } else {
          try {
            gapi.client.sheets.spreadsheets
              .create({
                properties: {
                  title: "test",
                },
              })
              .then((response: any) => {
                // if (callback) callback(response);
                console.log("Spreadsheet ID: " + response.result.spreadsheetId);
              });
          } catch (err: any) {
            console.log(err.message)
          }
        }
  };

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
