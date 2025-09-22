import type { createFormData } from "hooks/useCreateSheet";
import type { ieltsAnswerSheet } from "types/ielts-answer-sheet";
import type { ieltsAnswerSheets } from "types/ielts-answer-sheets";
import type { ieltsAnswerSheetsList } from "types/ielts-answer-sheets-list";

export const hasSheetWithName = async (spreadsheetId: string, name: string) => {
  try {
    const response = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheets = response.result.sheets || [];

    return sheets.some((sheet) => sheet.properties?.title === name);
  } catch (error) {
    console.error("Error fetching spreadsheet:", error);
    return false;
  }
};

export const renameFirstSheet = async (
  file: gapi.client.sheets.Spreadsheet,
  newTitle: string
) => {
  if (!file.sheets || file.sheets.length === 0) {
    throw new Error("Spreadsheet has no sheets");
  }

  const firstSheetId = file.sheets[0].properties?.sheetId;
  if (firstSheetId === undefined) {
    throw new Error("First sheet ID not found");
  }

  try {
    const response = await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: file.spreadsheetId!,
      resource: {
        requests: [
          {
            updateSheetProperties: {
              properties: {
                sheetId: firstSheetId,
                title: newTitle,
              },
              fields: "title",
            },
          },
        ],
      },
    });
    return response.result;
  } catch (err) {
    console.error("Error renaming sheet:", err);
    throw err;
  }
};

export const createNewSheet = async (
  file: gapi.client.sheets.Spreadsheet,
  title: string
) => {
  try {
    const response = await gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: file.spreadsheetId!,
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                title: title,
              },
            },
          },
        ],
      },
    });
    return response.result;
  } catch (err: any) {
    console.error("Error creating new sheet:", err);
    throw err.result.error.message;
  }
};

export const createNewSpreadsheet = async (fileName: string) => {
  const response = await gapi.client.sheets.spreadsheets.create({
    resource: {
      properties: {
        title: fileName,
      },
    },
  });
  if (!response.result || !response.result.spreadsheetId) {
    throw new Error("Failed to create spreadsheet");
  }
  const spreadsheetId = response.result.spreadsheetId;
  const sheetId = response.result.sheets?.[0].properties?.sheetId;
   await gapi.client.sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    resource: {
      requests: [
        {
          updateSheetProperties: {
            properties: {
              sheetId: sheetId,
              title: "Summary",
            },
            fields: "title",
          },
        },
      ],
    },
  });
  return response.result;
};


export const writeTitleSheet = async (createFormData: createFormData) => {
  const ieltsAnswerSheet: ieltsAnswerSheet = {
    type: createFormData.type,
    version: createFormData.version,
    totalScore: createFormData.totalScore,
    createdAt: createFormData.createdAt,
    updatedAt: createFormData.updatedAt,
    answers: createFormData.answers,
  }
  const ieltsAnswerSheets: ieltsAnswerSheets = {
    title: createFormData.title,
    createdAt: createFormData.createdAt,
    updatedAt: createFormData.updatedAt,
    highestScore: createFormData.totalScore,
    highestVersionType: createFormData.type,
    items: [ieltsAnswerSheet],
  }

  // create asset link
  // save to title sheet

}

export const writeSummarySheet = async () => {
  const summaryDataItem: ieltsAnswerSheetsList[number] = {
    title: "Sample Title",
    highestVersionType: "exercise",
    updatedAt: new Date(),
    highestScore: 30,
    id: "sample-id",
    thumbnail: "",
  }

  

}