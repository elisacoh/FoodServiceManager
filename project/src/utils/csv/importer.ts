import { ImportResult, CSVRow } from './types';
import { parseCSV } from './parser';

export async function importCSVFiles<T>(
  files: FileList,
  parser: (rows: CSVRow[]) => T[],
  onFileProcessed: (result: ImportResult) => void
): Promise<T[]> {
  const allData: T[] = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      const data = parser(rows);
      
      allData.push(...data);
      onFileProcessed({
        success: true,
        fileName: file.name,
        data
      });
    } catch (error) {
      onFileProcessed({
        success: false,
        fileName: file.name,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  return allData;
}