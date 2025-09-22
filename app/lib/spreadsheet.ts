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


export const writeTitleSheet = async (
  spreadsheetId: string,
  sheetName: string,
  createFormData: createFormData
) => {
  const ieltsAnswerSheet: ieltsAnswerSheet = {
    type: createFormData.type,
    version: createFormData.version,
    totalScore: createFormData.totalScore,
    createdAt: createFormData.createdAt,
    updatedAt: createFormData.updatedAt,
    answers: createFormData.answers,
  };

  // 1. Fetch existing data in the sheet
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName,
  });
  const values = response.result.values ?? [];

  // 2. Prepare header row:
  // 5 fixed headers + 40 numbered columns for answers (e.g. "1", "2", ..., "40")
  const headers = [
    "type",
    "version",
    "totalScore",
    "createdAt",
    "updatedAt",
    ...Array.from({ length: 40 }, (_, i) => `${i + 1}`),
  ];

  // Format dates as ISO strings or string
  const createdAtStr =
    ieltsAnswerSheet.createdAt instanceof Date
      ? ieltsAnswerSheet.createdAt.toISOString()
      : "";

  const updatedAtStr =
    ieltsAnswerSheet.updatedAt instanceof Date
      ? ieltsAnswerSheet.updatedAt.toISOString()
      : "";

  // 3. Prepare answers data as array of strings in format "[response, isCorrect]"
  // Convert each answer to string like: "[response, isCorrect]"
  const answersColumns = ieltsAnswerSheet.answers.map((ans) => {
    // Convert response to string, keep isCorrect as boolean
    const responseStr =
      typeof ans.response === "string"
        ? `"${ans.response}"`
        : ans.response.toString();
    return `[${responseStr}, ${ans.isCorrect}]`;
  });

  // 4. Full data row: 5 fixed columns + 40 answers columns
  const dataRow = [
    ieltsAnswerSheet.type,
    ieltsAnswerSheet.version.toString(),
    ieltsAnswerSheet.totalScore.toString(),
    createdAtStr,
    updatedAtStr,
    ...answersColumns,
  ];

  if (values.length === 0) {
    // 5a. Sheet empty: write header + data row
    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      resource: {
        values: [headers, dataRow],
      },
    });
  } else {
    // 5b. Sheet has data: append data row only
    await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [dataRow],
      },
    });
  }
};


export const writeSummarySheet = async (spreadsheetId: string, sheetName: string, createFormData: createFormData) => {
  const summaryDataItem: ieltsAnswerSheetsList[number] = {
    title: createFormData.title,
    highestVersionType: createFormData.version,
    updatedAt: createFormData.updatedAt,
    highestScore: createFormData.totalScore,
    id: sheetName,
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfOZrqJle8FGRpv-YQP-dEMXkK1NIqXDiAog&s",
  }
  // 1. Read existing data from the summary sheet
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName,
  });

  const values = response.result.values ?? [];

  // 2. Define headers matching keys in summaryDataItem
  const headers = Object.keys(summaryDataItem);

  // 3. Prepare the row data in the order of headers
  const rowData = headers.map((key) => {
    const val = (summaryDataItem as any)[key];
    // Format dates to string if needed
    if (val instanceof Date) {
      return val.toISOString();
    }
    return val;
  });

  if (values.length === 0) {
    // 4a. Sheet is empty — write headers + row
    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: "RAW",
      resource: {
        values: [headers, rowData],
      },
    });
  } else {
    // 4b. Append only the new row (no headers)
    await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetName,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [rowData],
      },
    });
  }
}