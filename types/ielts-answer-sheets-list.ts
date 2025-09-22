import type { cardDisplay, pagination, withId } from "./ultility";
import type { ieltsAnswerSheets } from "./ielts-answer-sheets";

export type ieltsAnswerSheetsList = (Pick<ieltsAnswerSheets,"title" | "highestVersionType" | "updatedAt" | "highestScore"> & withId & cardDisplay)[] 