export type ieltsAnswerSheet = {
    version: number,
    answers: Answer[],
    totalScore: number,
    createdAt: Date,
    updatedAt: Date,
    type: "mock" | "exercise",
}

type Answer = {
    response: string | number,
    isCorrect: boolean,
}