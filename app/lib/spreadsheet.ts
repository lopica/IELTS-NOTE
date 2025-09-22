export const hasSheetWithName = async (spreadsheetId: string, name: string) => {
  try {
    const response = await gapi.client.sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheets = response.result.sheets || [];

    return sheets.some(
      (sheet) => sheet.properties?.title === name
    );
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
  } catch (err) {
    console.error("Error creating new sheet:", err);
    throw err;
  }
};
