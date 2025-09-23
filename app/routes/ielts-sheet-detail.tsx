import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
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
import { getMetaSheetVersion, readSheetVersion } from "~/lib/spreadsheet";

export default function IeltsSheetDetail() {
  const [type, setType] = useState<"mock" | "exercise">("exercise");
  const [mode, setMode] = useState<"edit" | "view">("view");
  const [version, setVersion] = useState(1);
  const { id } = useParams<{ id: string }>();

  const { data: data1 } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => readSheetVersion(id ?? "", version),
  });

  const {
    isPending,
    error,
    data: metaData,
  } = useQuery({
    queryKey: ["repoData2"],
    queryFn: () => getMetaSheetVersion(id ?? ""),
  });

  console.log(data1);

  if (error) {
    return "Something when wrong";
  }

  return (
    <form>
      <div className="flex justify-center items-center">
        <TitleInput label="title" mode={mode} value={metaData?.id} />
      </div>

      <div className="flex justify-end items-end flex-wrap my-4 gap-8">
        <Select defaultValue="1">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select sheet type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.from({ length: metaData?.totalVersion ?? 1 }).map(
                (_, i) => (
                  <SelectItem
                    value={(i + 1).toString()}
                    key={i}
                  >{`Version ${i + 1}`}</SelectItem>
                )
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button>Add new version</Button>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 mb-8 text-3xl">
        <Select
          value={type}
          onValueChange={(value) => setType(value as "mock" | "exercise")}
          disabled
        >
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

      <div className="md:max-w-4xl mx-auto p-4 sm:p-6 bg-white">
        <IeltsSheet mode={mode} />
      </div>
      <div className="mt-4 mr-56 flex justify-end">
        {mode === "edit" && <Button>Save</Button>}
      </div>
    </form>
  );
}
