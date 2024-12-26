import { Recipe, Inventory } from '../types';

export interface ImportResult {
  success: boolean;
  fileName: string;
  data: any[];
  error?: string;
}

export async function importCSVFiles(
  files: FileList,
  onFileProcessed: (result: ImportResult) => void
): Promise<void> {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      // Read file content
      const text = await file.text();
      
      // Parse CSV
      const rows = text.split('\n').filter(row => row.trim());
      const headers = rows[0].split(',').map(h => h.trim());
      
      const data = rows.slice(1).map(row => {
        const values = row.split(',').map(v => v.trim());
        return headers.reduce((obj: any, header, index) => {
          obj[header] = values[index] || '';
          return obj;
        }, {});
      });

      // Report success
      onFileProcessed({
        success: true,
        fileName: file.name,
        data
      });
    } catch (error) {
      // Report error
      onFileProcessed({
        success: false,
        fileName: file.name,
        data: [],
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}