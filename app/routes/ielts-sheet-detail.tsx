import { useQuery } from "@tanstack/react-query";
import { useIeltsSheetCreateContext } from "context/ielts-sheet-create-context";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
  const {handleVersionData} = useIeltsSheetCreateContext()
  // const navigate = useNavigate()

  const { isPending,
    error, data: sheetData } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => readSheetVersion(id ?? "", version),
    enabled: !!id && !!version,
  });

  const {
    isPending: isMetaPending,
    error: metaError,
    data: metaData,
  } = useQuery({
    queryKey: ["repoData2"],
    queryFn: () => getMetaSheetVersion(id ?? ""),
    enabled: !!id,
  });

  useEffect(()=>{
    if (!isPending && !error && sheetData) handleVersionData(sheetData)
  },[isPending, error, sheetData])


  useEffect(()=>{
    if (mode === "edit" && metaData) setVersion(metaData?.totalVersion ?? 0 + 1)
  },[mode, metaData])

  useEffect(()=>{
    if (metaData && version !== (metaData?.totalVersion + 1)) setMode("view")
  },[version, metaData])

  if (error) {
    return "Something when wrong";
  }


  return (
    <form>
      <div className="flex justify-center items-center">
        <TitleInput label="title" mode="view" value={id} />
      </div>

      <div className="flex justify-end items-end flex-wrap my-4 gap-8">
        <Select defaultValue="1" onValueChange={(val) => setVersion(parseInt(val))} value={mode === "view" ? version.toString() : ((metaData?.totalVersion ?? 1 )+ 1).toString()}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select sheet type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Array.from({ length: mode === "view" ? metaData?.totalVersion ?? 1 : (metaData?.totalVersion ?? 1 ) + 1 }).map(
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
        <Button disabled={!metaData?.totalVersion} onClick={(e) => {
            e.preventDefault()
            setMode("edit")
        }}>Add new version</Button>
      </div>
      <div className="flex flex-col justify-center items-center gap-4 mb-8 text-3xl">
        <Select
          value={type}
          onValueChange={(value) => setType(value as "mock" | "exercise")}
          disabled={mode === "view"}
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
