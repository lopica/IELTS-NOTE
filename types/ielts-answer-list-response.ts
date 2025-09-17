import type { cardDisplay, pagination, withId } from "./ultility";
import type { ieltsAnswerSheetResponse } from "./ielts-answer-sheet-response";

export type ieltsAnswerListResponse = (Pick<ieltsAnswerSheetResponse,"title" | "highestVersionType" | "updatedAt" | "highestScore"> & withId & cardDisplay)[] & pagination