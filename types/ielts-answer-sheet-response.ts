import type { ieltsAnswerSheet } from "./ielts-answer-sheet"

export type ieltsAnswerSheetResponse = {
    title: string,
    updatedAt: Date,
    type: "mock" | "exercise",
    asset: string,
    items: ieltsAnswerSheet[],
}