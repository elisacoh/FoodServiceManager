export interface CSVRow {
  [key: string]: string;
}

export interface ImportResult {
  success: boolean;
  fileName: string;
  data: any[];
  error?: string;
}