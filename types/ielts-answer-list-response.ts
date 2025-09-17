import type { cardDisplay, withId } from "./ultility";
import type { pagination } from "./pagination";
import type { ieltsAnswerSheetResponse } from "./ielts-answer-sheet-response";

export type ieltsAnswerListResponse = (Pick<ieltsAnswerSheetResponse,"title" | "type" | "updatedAt"> & withId & cardDisplay)[] & pagination