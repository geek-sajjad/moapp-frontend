import { Component, input, output, signal, effect, HostListener, ElementRef, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { format as formatJalali, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, parse as parseJalali, isValid } from 'date-fns-jalali';

@Component({
  selector: 'app-persian-datepicker',
  imports: [CommonModule, IconComponent],
  templateUrl: './persian-datepicker.component.html',
  styles: [`
    :host {
      display: block;
      position: relative;
    }
  `]
})
export class PersianDatepickerComponent implements OnInit {
  value = input<string>('');
  placeholder = input<string>('تاریخ را انتخاب کنید');
  
  onChange = output<string>();
  
  isOpen = signal<boolean>(false);
  currentMonth = signal<Date>(new Date());
  selectedDate = signal<Date | null>(null);
  monthName = computed(() => {
    try {
      const date = this.currentMonth();
      if (!isValid(date)) {
        return '';
      }
      return formatJalali(date, 'MMMM yyyy');
    } catch (e) {
      console.error('Error formatting month name:', e);
      return '';
    }
  });
  calendarDays = computed(() => {
    const current = this.currentMonth();
    if (!isValid(current)) {
      return [];
    }
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    const days = eachDayOfInterval({ start, end });

    // Get the day of week for the first day (Saturday = 0 in Jalali)
    const firstDayOfWeek = (getDay(start) + 1) % 7; // Convert to Jalali week

    // Add empty cells for days before the first day of the month
    const emptyDays = Array(firstDayOfWeek).fill(null);

    return [...emptyDays, ...days];
  });
  
  weekDays = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  
  constructor(private elementRef: ElementRef) {
    effect(() => {
      const val = this.value();
      if (val) {
        // Schedule the update to avoid ExpressionChangedAfterItHasBeenCheckedError
        setTimeout(() => {
          this.updateDateFromValue(val);
        }, 0);
      }
    }, { allowSignalWrites: true });
  }
  
  ngOnInit(): void {
    // Initialize with current value if available
    const val = this.value();
    if (val) {
      this.updateDateFromValue(val);
    }
  }
  
  private updateDateFromValue(val: string): void {
    try {
      // Parse Persian date string (e.g., "1403/11/13")
      const parsedDate = parseJalali(val, 'yyyy/MM/dd', new Date());
      if (isValid(parsedDate)) {
        this.selectedDate.set(parsedDate);
        this.currentMonth.set(parsedDate);
      }
    } catch (e) {
      console.error('Invalid date format:', e);
    }
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen.set(false);
    }
  }
  
  toggleCalendar(): void {
    this.isOpen.set(!this.isOpen());
  }
  
  previousMonth(): void {
    this.currentMonth.set(subMonths(this.currentMonth(), 1));
  }
  
  nextMonth(): void {
    this.currentMonth.set(addMonths(this.currentMonth(), 1));
  }
  
  selectDate(date: Date | null): void {
    if (!date || !isValid(date)) return;
    
    this.selectedDate.set(date);
    const formattedDate = formatJalali(date, 'yyyy/MM/dd');
    this.onChange.emit(formattedDate);
    this.isOpen.set(false);
  }
  
  isSelectedDate(date: Date | null): boolean {
    if (!date || !this.selectedDate()) return false;
    return isSameDay(date, this.selectedDate()!);
  }
  
  isToday(date: Date | null): boolean {
    if (!date) return false;
    return isSameDay(date, new Date());
  }
  
  formatDisplayValue(): string {
    const val = this.value();
    return val || '';
  }
  
  selectToday(): void {
    this.selectDate(new Date());
  }
  
  getPersianDayNumber(date: Date): string {
    try {
      if (!isValid(date)) {
        return '';
      }
      return formatJalali(date, 'd');
    } catch (e) {
      console.error('Error formatting day number:', e);
      return '';
    }
  }
}
