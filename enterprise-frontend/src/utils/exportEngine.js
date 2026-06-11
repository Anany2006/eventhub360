import * as XLSX from 'xlsx';

/**
 * Parses raw JSON dataset tables into clean, formatted downloadable Excel documents.
 * @param {Array} data - The array of objects fetched from the database endpoint.
 * @param {string} sheetName - The internal title assigned to the spreadsheet worksheet tab.
 * @param {string} fileName - The final output name for the generated .xlsx file.
 */
export const exportToExcel = (data, sheetName = 'Data Matrix', fileName = 'Live_Export') => {
  try {
    if (!data || data.length === 0) {
      alert("No data records available to compile into an export deliverable.");
      return;
    }

    // 1. Convert the JSON array structure into a standard worksheet matrix
    const worksheet = XLSX.utils.json_to_sheet(data);

    // 2. Initialize an empty Excel workbook container
    const workbook = XLSX.utils.book_new();

    // 3. Append the worksheet matrix tab into our workbook container
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // 4. Generate the binary spreadsheet stream and trigger an instant client download
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
    
    console.log(`Successfully compiled and downloaded: ${fileName}.xlsx`);
  } catch (error) {
    console.error("Excel data portability engine failure:", error);
    alert("An error occurred while compiling your data download payload.");
  }
};