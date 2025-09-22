import type { ieltsAnswerSheet } from "./ielts-answer-sheet"

export type ieltsAnswerSheets = {
    title: string,
    createdAt: Date,
    updatedAt: Date,
    highestScore: number,
    highestVersionType: string,
<<<<<<< HEAD:types/ielts-answer-sheet-response.ts
    asset: string,
=======
>>>>>>> save-form:types/ielts-answer-sheets.ts
    items: ieltsAnswerSheet[],
}

