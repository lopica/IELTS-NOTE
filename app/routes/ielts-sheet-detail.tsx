import { useEffect, useState } from "react";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "IELTS NOTES" },
    { name: "description", content: "Webapp to store ielts mock test" },
  ];
}

export default function IeltsSheetDetail() {
  return <>
  </>
}
