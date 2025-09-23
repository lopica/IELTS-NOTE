import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import type { Route } from "../+types/root";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { readSummary } from "~/lib/spreadsheet";
import { useEffect } from "react";
import { toast } from "sonner";
import { formatScore } from "~/lib/utils";

export default function IeltsSheetList() {
  const { isPending, error, data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => readSummary(),
  });

  if (error) {
    console.error(error);
  }

  return (
    <section className="mt-8 mx-8">
      <div className="flex justify-end items-center">
        <Link to="/list/create">
          <Button className=" bg-green-600 hover:bg-green-500 hover:cursor-pointer">
            New Sheet
          </Button>
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-12 my-8">
        {isPending && "loading..."}
        {((!isPending && !error && data.length === 0) || error) &&
          "Let's create the first note!"}
        {!isPending &&
          !error &&
          Array.isArray(data) &&
          data.map((item) => (
            <Link to={item?.id} key={item?.id}>
              <Card>
                <CardHeader>
                  <CardTitle>{item.id}</CardTitle>
                  <CardDescription>{item.highestVersionType}</CardDescription>
                  <CardAction>{formatScore(item.highestScore)}</CardAction>
                </CardHeader>
                <CardContent>
                  <img src={item.thumbnail} alt="thubnail" />
                </CardContent>
                <CardFooter>
                  <p>{item.updatedAt.toLocaleDateString("vi-VN")}</p>
                </CardFooter>
              </Card>
            </Link>
          ))}
      </div>
    </section>
  );
}
