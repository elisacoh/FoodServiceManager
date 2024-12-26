import { CSVRow } from '../types';
import { Inventory } from '../../../types';

export function parseInventoryCSV(rows: CSVRow[]): Inventory[] {
  return rows.map(row => ({
    date: row.date,
    ingredient: row.ingredient,
    stockRemaining: parseFloat(row.stockRemaining) || 0
  }));
}