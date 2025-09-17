import type { ieltsAnswerSheet } from "./ielts-answer-sheet"

export type ieltsAnswerSheetResponse = {
    title: string,
    createdAt: Date,
    updatedAt: Date,
    highestScore: number,
    highestVersionType: string,
    asset: string,
    items: ieltsAnswerSheet[],
}