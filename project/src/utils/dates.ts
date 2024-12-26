import { format, parseISO } from 'date-fns';

export const formatDate = (date: string): string => {
  return format(parseISO(date), 'MMM d, yyyy');
};

export const getCurrentDate = (): string => {
  return format(new Date(), 'yyyy-MM-dd');
};