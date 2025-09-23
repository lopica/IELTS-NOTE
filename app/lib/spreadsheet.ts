import type { createFormData } from "hooks/useCreateSheet";
import type { ieltsAnswerSheet } from "types/ielts-answer-sheet";
import type { ieltsAnswerSheets } from "types/ielts-answer-sheets";
import type { ieltsAnswerSheetsList } from "types/ielts-answer-sheets-list";
import { checkIfSheetExists } from "./drive";

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
  localStorage.setItem("spreadsheetId", spreadsheetId);

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

export const writeSummarySheet = async (
  spreadsheetId: string,
  sheetName: string,
  createFormData: createFormData
) => {
  const summaryDataItem: ieltsAnswerSheetsList[number] = {
    id: createFormData.title,
    highestVersionType: createFormData.type,
    updatedAt: createFormData.updatedAt,
    highestScore: createFormData.totalScore,
    thumbnail:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfOZrqJle8FGRpv-YQP-dEMXkK1NIqXDiAog&s",
    totalVersion: 1,
  };

  // 1. Đọc dữ liệu hiện tại
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: sheetName,
  });

  const values = response.result.values ?? [];

  const headers = values[0] ?? Object.keys(summaryDataItem);
  
  // Tìm index các cột cần thiết
  const idIndex = headers.indexOf("id");
  const highestScoreIndex = headers.indexOf("highestScore");
  const highestVersionTypeIndex = headers.indexOf("highestVersionType");
  const totalVersionIndex = headers.indexOf("totalVersion");

  // Tìm row mà id === createFormData.title
  const rowIndex = values.findIndex(
    (row, i) => i > 0 && row[idIndex] === createFormData.title
  );

  if (rowIndex === -1) {
    // Chưa tồn tại, thêm mới (kèm headers nếu sheet trống)
    const rowData = headers.map((key) => {
      const val = (summaryDataItem as any)[key];
      if (val instanceof Date) return val.toISOString();
      return val;
    });

    if (values.length === 0) {
      // Ghi headers + dữ liệu
      await gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: "RAW",
        resource: {
          values: [headers, rowData],
        },
      });
    } else {
      // Append dữ liệu mới
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
  } else {
    // Row đã tồn tại, cập nhật dữ liệu theo yêu cầu

    // Lấy dữ liệu cũ
    const existingRow = values[rowIndex];
    let updatedHighestScore = existingRow[highestScoreIndex];
    let updatedHighestVersionType = existingRow[highestVersionTypeIndex];
    let updatedTotalVersion = existingRow[totalVersionIndex] ?? "0";

    // Convert để so sánh
    const oldScore = Number(updatedHighestScore);
    const newScore = Number(createFormData.totalScore);
    let totalVersionNum = Number(updatedTotalVersion);

    // Cập nhật totalVersion tăng thêm 1
    totalVersionNum++;

    // Nếu điểm mới lớn hơn thì update highestScore và highestVersionType
    if (newScore > oldScore) {
      updatedHighestScore = newScore.toString();
      updatedHighestVersionType = createFormData.type;
    }

    // Chuẩn bị dữ liệu cập nhật
    const updatedRow = [...existingRow];
    updatedRow[highestScoreIndex] = updatedHighestScore;
    updatedRow[highestVersionTypeIndex] = updatedHighestVersionType;
    updatedRow[totalVersionIndex] = totalVersionNum.toString();

    // Cập nhật lại row trong sheet
    // Vị trí bắt đầu là A2 (vì A1 là header), nên rowIndex = 1 tương ứng A2
    // Cột bắt đầu từ A, nên range = `${sheetName}!A${rowIndex + 1}`

    await gapi.client.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A${rowIndex + 1}`,
      valueInputOption: "RAW",
      resource: {
        values: [updatedRow],
      },
    });
  }
};


export const readSummary = async (): Promise<ieltsAnswerSheetsList> => {
  let existingFile;
  const fileName = "Ielts Note";

  try {
    existingFile = await checkIfSheetExists(fileName);
  } catch (error) {
    throw new Error("Timout error when checking for existing file.");
  }
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: existingFile?.spreadsheetId ?? "",
    range: "summary",
  });

  const values = response.result.values;

  if (!values || values.length < 2) {
    // No data or only header row
    return [];
  }

  const [headerRow, ...dataRows] = values;

  // Map each row to an object based on header names
  const result = dataRows.map((row) => {
    const obj: any = {};
    headerRow.forEach((key, idx) => {
      let value = row[idx] ?? "";

      // Try to coerce number fields

      if (key === "updatedAt" || key === "createdAt") {
        // Make sure it's a valid date string before converting
        value = value ? new Date(value) : null;
      }

      obj[key] = value;
    });

    return obj as ieltsAnswerSheetsList[number];
  });

  return result;
};

export const readSheetVersion = async (
  title: string,
  version: number
): Promise<ieltsAnswerSheet | null> => {
  let existingFile;
  const fileName = "Ielts Note";

  try {
    existingFile = await checkIfSheetExists(fileName);
  } catch (error) {
    throw new Error("Timout error when checking for existing file.");
  }

  // Get data from the sheet with the given title
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: existingFile?.spreadsheetId ?? "",
    range: title, // Sheet name is the title passed in
  });

  const values = response.result.values;
  if (!values || values.length < 2) {
    // No data or only headers
    return null;
  }

  const [headerRow, ...dataRows] = values;

  // Find the row that matches the version
  const versionIdx = headerRow.indexOf("version");
  if (versionIdx === -1) {
    throw new Error("Sheet does not contain a 'version' column");
  }

  // Build ieltsAnswerSheet object from the row
  for (const row of dataRows) {
    if (parseInt(row[versionIdx]) === version) {
      const obj: any = {};
      headerRow.forEach((key, idx) => {
        let value = row[idx] ?? "";

        if (key === "createdAt" || key === "updatedAt") {
          value = value ? new Date(value) : null;
        } else if (key === "totalScore" || key === "version") {
          value = parseInt(value);
        }

        obj[key] = value;
      });

      // Extract answers (columns after the first 5 fixed ones)
      const answers = headerRow
        .slice(5) // after type, version, totalScore, createdAt, updatedAt
        .map((_, idx) => {
          const raw = row[5 + idx];
          if (!raw) return { response: "", isCorrect: false };

          try {
            // Expecting format like [response, true]
            const parsed = JSON.parse(raw.replace(/'/g, '"'));
            return {
              response: parsed[0],
              isCorrect: parsed[1],
            };
          } catch {
            return { response: "", isCorrect: false };
          }
        });

      return {
        type: obj.type,
        version: obj.version,
        totalScore: obj.totalScore,
        createdAt: obj.createdAt,
        updatedAt: obj.updatedAt,
        answers,
      } as ieltsAnswerSheet;
    }
  }

  return null; // No matching version found
};

export const getMetaSheetVersion = async (
  title: string
): Promise<ieltsAnswerSheetsList[number] | null> => {
  let existingFile;
  const fileName = "Ielts Note";

  try {
    existingFile = await checkIfSheetExists(fileName);
  } catch (error) {
    throw new Error("Timout error when checking for existing file.");
  }

  // 1. Read data from the summary sheet
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: existingFile?.spreadsheetId ?? "",
    range: "summary", // assuming the sheet is called "summary"
  });

  const values = response.result.values;
  if (!values || values.length < 2) {
    // no data or only header row
    return null;
  }

  // 2. Extract header row and data rows
  const [headerRow, ...dataRows] = values;

  // 3. Find the row that matches the title
  for (const row of dataRows) {
    const rowObj: any = {};
    headerRow.forEach((key, idx) => {
      let value = row[idx] ?? "";

      // Handle date fields
      if (key === "updatedAt" || key === "createdAt") {
        value = value ? new Date(value) : null;
      } else if (key === "highestScore" || key === "totalVersion") {
        value = parseInt(value);
      }
      

      rowObj[key] = value;
    });

    if (rowObj.id === title) {
      return rowObj as ieltsAnswerSheetsList[number];
    }
  }

  return null; // no matching row found
};
