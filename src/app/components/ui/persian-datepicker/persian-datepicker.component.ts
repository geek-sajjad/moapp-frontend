import {
  Component,
  input,
  output,
  signal,
  effect,
  HostListener,
  ElementRef,
  OnInit,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';
import { PersianCalendarService } from '../../../services/persian-calendar.service';

@Component({
  selector: 'app-persian-datepicker',
  imports: [CommonModule, IconComponent],
  templateUrl: './persian-datepicker.component.html',
  styles: [
    `
      :host {
        display: block;
        position: relative;
      }
    `,
  ],
})
export class PersianDatepickerComponent implements OnInit {
  value = input<string>(''); // Expects Gregorian ISO string (e.g., "2024-02-01T00:00:00.000Z")
  // value = input<Date>();
  placeholder = input<string>('تاریخ را انتخاب کنید');

  onChange = output<string>(); // Emits Gregorian ISO string
  // onChange = output<Date>(); // Emits Gregorian Date

  isOpen = signal<boolean>(false);
  currentMonth = signal<Date>(new Date()); // Gregorian Date for internal use
  selectedDate = signal<Date | null>(null); // Gregorian Date stored internally
  monthName = computed(() => {
    const formatted = this.calendarService.formatMonthName(this.currentMonth());
    return this.calendarService.toPersianNumbers(formatted);
  });
  calendarDays = computed(() => this.calendarService.getCalendarDays(this.currentMonth()));

  get weekDays(): string[] {
    return this.calendarService.weekDays;
  }

  constructor(
    private elementRef: ElementRef,
    private calendarService: PersianCalendarService,
  ) {
    effect(
      () => {
        const val = this.value();
        if (val) {
          // Schedule the update to avoid ExpressionChangedAfterItHasBeenCheckedError
          setTimeout(() => {
            this.updateDateFromValue(val);
          }, 0);
        }
      },
      { allowSignalWrites: true },
    );
  }

  ngOnInit(): void {
    // Initialize with current value if available
    const val = this.value();
    if (val) {
      this.updateDateFromValue(val);
    }
  }

  private updateDateFromValue(val: string): void {
    const parsedDate = this.calendarService.parseGregorianDate(val);
    if (parsedDate) {
      this.selectedDate.set(parsedDate);
      this.currentMonth.set(parsedDate);
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
    this.currentMonth.set(this.calendarService.getPreviousMonth(this.currentMonth()));
  }

  nextMonth(): void {
    this.currentMonth.set(this.calendarService.getNextMonth(this.currentMonth()));
  }

  selectDate(date: Date | null): void {
    if (!this.calendarService.isValidDate(date)) return;

    // Store as Gregorian Date
    this.selectedDate.set(date);
    console.log(this.selectedDate());

    // Emit Gregorian ISO string for backend
    this.onChange.emit(this.calendarService.toISOString(date!));
    this.isOpen.set(false);
  }

  isSelectedDate(date: Date | null): boolean {
    return this.calendarService.isSameDay(date, this.selectedDate());
  }

  isToday(date: Date | null): boolean {
    return this.calendarService.isToday(date);
  }

  formatDisplayValue(): string {
    return this.calendarService.formatDisplayValue(this.value());
  }

  selectToday(): void {
    this.selectDate(this.calendarService.getCurrentDate());
  }

  getPersianDayNumber(date: Date): string {
    return this.calendarService.getPersianDayNumber(date);
  }
}
