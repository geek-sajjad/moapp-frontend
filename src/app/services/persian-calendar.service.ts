import { Injectable } from '@angular/core';
import { 
  format as formatJalali, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  getDay, 
  isSameDay, 
  isValid 
} from 'date-fns-jalali';

export interface CalendarDay {
  date: Date | null;
  isCurrentMonth: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PersianCalendarService {
  private readonly persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  readonly weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];

  /**
   * Converts English/Arabic digits to Persian digits
   */
  toPersianNumbers(input: string): string {
    return input.replace(/\d/g, (digit) => this.persianDigits[parseInt(digit)]);
  }

  /**
   * Formats a date in Jalali format
   */
  formatJalaliDate(date: Date, formatPattern: string = 'yyyy/MM/dd'): string {
    try {
      if (!isValid(date)) {
        return '';
      }
      return formatJalali(date, formatPattern);
    } catch (e) {
      console.error('Error formatting Jalali date:', e);
      return '';
    }
  }

  /**
   * Formats month name in Jalali calendar
   */
  formatMonthName(date: Date): string {
    try {
      if (!isValid(date)) {
        return '';
      }
      return formatJalali(date, 'MMMM yyyy');
    } catch (e) {
      console.error('Error formatting month name:', e);
      return '';
    }
  }

  /**
   * Gets Persian day number from a date
   */
  getPersianDayNumber(date: Date): string {
    try {
      if (!isValid(date)) {
        return '';
      }
      const day = formatJalali(date, 'd');
      return this.toPersianNumbers(day);
    } catch (e) {
      console.error('Error formatting day number:', e);
      return '';
    }
  }

  /**
   * Formats a Gregorian date for display in Persian format
   */
  formatDisplayValue(gregorianDateString: string): string {
    if (!gregorianDateString) return '';
    
    try {
      const gregorianDate = new Date(gregorianDateString);
      if (isValid(gregorianDate) && !isNaN(gregorianDate.getTime())) {
        const jalaliFormatted = this.formatJalaliDate(gregorianDate, 'yyyy/MM/dd');
        return this.toPersianNumbers(jalaliFormatted);
      }
      return '';
    } catch (e) {
      console.error('Error formatting display value:', e);
      return '';
    }
  }

  /**
   * Parses a Gregorian date string and returns a valid Date object
   */
  parseGregorianDate(dateString: string): Date | null {
    try {
      const parsedDate = new Date(dateString);
      if (isValid(parsedDate) && !isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
      return null;
    } catch (e) {
      console.error('Invalid date format:', e);
      return null;
    }
  }

  /**
   * Gets calendar days for a given month with empty cells for alignment
   */
  getCalendarDays(currentMonth: Date): (Date | null)[] {
    if (!isValid(currentMonth)) {
      return [];
    }

    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });

    // Get the day of week for the first day (Saturday = 0 in Jalali)
    const firstDayOfWeek = (getDay(start) + 1) % 7; // Convert to Jalali week

    // Add empty cells for days before the first day of the month
    const emptyDays = Array(firstDayOfWeek).fill(null);

    return [...emptyDays, ...days];
  }

  /**
   * Navigates to the previous month
   */
  getPreviousMonth(currentMonth: Date): Date {
    return subMonths(currentMonth, 1);
  }

  /**
   * Navigates to the next month
   */
  getNextMonth(currentMonth: Date): Date {
    return addMonths(currentMonth, 1);
  }

  /**
   * Checks if two dates are the same day
   */
  isSameDay(date1: Date | null, date2: Date | null): boolean {
    if (!date1 || !date2) return false;
    return isSameDay(date1, date2);
  }

  /**
   * Checks if a date is today
   */
  isToday(date: Date | null): boolean {
    if (!date) return false;
    return isSameDay(date, new Date());
  }

  /**
   * Validates a date
   */
  isValidDate(date: Date | null): boolean {
    if (!date) return false;
    return isValid(date) && !isNaN(date.getTime());
  }

  /**
   * Converts a Date to ISO string for backend
   */
  toISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Gets current date
   */
  getCurrentDate(): Date {
    return new Date();
  }
}
