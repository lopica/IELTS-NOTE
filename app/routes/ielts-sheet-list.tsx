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
    toast.error("An error has occurred: ");
    console.error(error);
    return;
  }


  return (
    <section className="mt-8 mx-8">
      <div className="flex justify-end items-center">
        <Link to="/create">
          <Button className=" bg-green-600 hover:bg-green-500 hover:cursor-pointer">
            New Sheet
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-4 gap-12">
        {isPending && "loading..."}
        {!isPending &&
          !error &&
          data.length === 0 && "Let's create the first note!"}
        {!isPending &&
          !error &&
          data.map((item) => (
            <Link to={item.title}>
              <Card>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.highestVersionType}</CardDescription>
                  <CardAction>{formatScore(item.highestScore)}</CardAction>
                </CardHeader>
                <CardContent>
                  <img src={item.thumbnail} />
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
