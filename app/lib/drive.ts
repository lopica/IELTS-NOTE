export async function checkIfSheetExists(fileName: string): Promise<gapi.client.sheets.Spreadsheet | null> {
  try {
    // Step 1: Search for file by name in Drive
    const response = await gapi.client.drive.files.list({
      q: `name='${fileName}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
      fields: "files(id, name)",
      spaces: "drive",
    });

    const files = response.result.files;
    if (files && files.length > 0) {
      const spreadsheetId = files[0].id as string;

      // Step 2: Get spreadsheet metadata from Sheets API
      const sheetResponse = await gapi.client.sheets.spreadsheets.get({
        spreadsheetId,
        includeGridData: false,  // optional, if you want to avoid grid data
      });

      return sheetResponse.result;  // This is of type gapi.client.sheets.Spreadsheet
    } else {
      return null;
    }
  } catch (err) {
    throw err
  }
}
