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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IELTS NOTES" },
    { name: "description", content: "Webapp to store ielts mock test" },
  ];
}

export default function IeltsSheetList() {
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
        <Link to={"1"}>
          <Card>
            <CardHeader>
              <CardTitle>Cam 12 - test 1</CardTitle>
              <CardDescription>Mock</CardDescription>
              <CardAction>6.0</CardAction>
            </CardHeader>
            <CardContent>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfOZrqJle8FGRpv-YQP-dEMXkK1NIqXDiAog&s" />
            </CardContent>
            <CardFooter>
              <p>7:30 12/7/2025</p>
            </CardFooter>
          </Card>
        </Link>
        <Link to={"2"}>
          <Card>
            <CardHeader>
              <CardTitle>Cam 12 - test 1</CardTitle>
              <CardDescription>Exercise</CardDescription>
              <CardAction>7.0</CardAction>
            </CardHeader>
            <CardContent>
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfOZrqJle8FGRpv-YQP-dEMXkK1NIqXDiAog&s" />
            </CardContent>
            <CardFooter>
              <p>7:30 12/7/2025</p>
            </CardFooter>
          </Card>
        </Link>
      </div>
    </section>
  );
}
