import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

import { fromEvent, interval, merge, NEVER } from 'rxjs';
import { switchMap, startWith, scan, tap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements AfterViewInit {

  @Input() date: HTMLInputElement;
  @Input() time: HTMLInputElement;
  @Output() event: EventEmitter<boolean> = new EventEmitter<boolean>(false);

  private selectedDate: string;
  private selectedTime: string;

  private milliSecondsInASecond = 1000;
  private hoursInADay = 24;
  private minutesInAnHour = 60;
  private SecondsInAMinute = 60;

  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  now: number;
  then: number;
  diff: number;

  constructor() { }

  ngAfterViewInit(): void {

    const interval$ = interval(1000);

    merge(
      fromEvent((this.date), 'change'),
      fromEvent((this.time), 'change')
    )
      .pipe(
        tap(_ => this.event.emit(false)),
        startWith(({isEnd: false})),
        scan((acc, val) => ({ ...acc, ...val })),
        switchMap((state: { isEnd: boolean }) => state.isEnd ? NEVER : interval$.pipe(
          // takeWhile(_ => !state.isEnd),
          tap(_ => {

            this.selectedDate = this.date.value;
            this.selectedTime = this.time.value;

            this.now = Date.now();
            this.then = new Date(`${this.selectedDate} ${this.selectedTime}`).getTime();

            this.diff = this.then - this.now;

            if (this.diff > 0) {
              this.days = this.calculateDays(this.diff);
              this.hours = this.calculateHours(this.diff);
              this.minutes = this.calculateMinutes(this.diff);
              this.seconds = this.calculateSeconds(this.diff);
            }

            state.isEnd = this.days === 0 && this.hours === 0 && this.minutes === 0 && this.seconds === 0;

            if (state.isEnd) {
              this.days = 0;
              this.hours = 0;
              this.minutes = 0;
              this.seconds = 0;
              this.event.emit(true);
              state.isEnd = false;
            }

          })
        ))
      ).subscribe();

  }

  calculateDays(diff: number): number {
    return Math.floor((this.diff) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute * this.hoursInADay));
  }

  calculateHours(diff: number): number {
    return Math.floor((diff) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
  }

  calculateMinutes(diff: number): number {
    return Math.floor((diff) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
  }

  calculateSeconds(diff: number): number {
    return Math.floor((diff) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
  }

}
