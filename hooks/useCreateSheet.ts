export default function useCreateSheet() {
     async function checkIfSheetExists(fileName: string) {
    try {
      const response = await gapi.client.drive.files.list({
        q: `name='${fileName}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`,
        fields: "files(id, name)",
      });

      const files = response.result.files;
      if (files && files.length > 0) {
        return files[0]; // Hoặc trả về true
      } else {
        return null;
      }
    } catch (err) {
      console.error("Error checking file:", err);
      return null;
    }
  }

  const handleCreate = async () => {
    const fileName = "test";
        const existingFile = await checkIfSheetExists(fileName);

        if (existingFile) {
          console.log("File already exists:", existingFile.id);
          // Optional: mở file, ghi thêm, v.v.
        } else {
          try {
            gapi.client.sheets.spreadsheets
              .create({
                properties: {
                  title: "test",
                },
              })
              .then((response: any) => {
                // if (callback) callback(response);
                console.log("Spreadsheet ID: " + response.result.spreadsheetId);
              });
          } catch (err: any) {
            console.log(err.message)
          }
        }
  };

  return { handleCreate };
}