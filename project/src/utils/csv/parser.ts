import { CSVRow } from './types';

export function parseCSV(text: string): CSVRow[] {
  const rows = text.split('\n').filter(row => row.trim());
  const headers = rows[0].split(',').map(h => h.trim());
  
  return rows.slice(1).map(row => {
    const values = row.split(',').map(v => v.trim());
    return headers.reduce((obj: CSVRow, header, index) => {
      obj[header] = values[index] || '';
      return obj;
    }, {});
  });
}