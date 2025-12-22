import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';


export async function updateExcelFile(filePath: string, sheetName: string, cell: string, newValue: any) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet(sheetName);

  if (worksheet) {
    const targetCell = worksheet.getCell(cell);
    targetCell.value = newValue; // Update the cell value

    await workbook.xlsx.writeFile(filePath); // Save the changes back to the file
    console.log(`Updated cell ${cell} in ${filePath}`);
  } else {
    throw new Error(`Worksheet "${sheetName}" not found`);
  }
}

// Function to read data (using xlsx library for simple JSON conversion)
export async function readExcelData(filePath: string, sheetName: string): Promise<any[]> {
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);
  return jsonData;
}