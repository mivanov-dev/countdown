import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';

import { fromEvent, interval, merge, NEVER, Observable } from 'rxjs';
import { switchMap, startWith, scan, tap } from 'rxjs/operators';

interface State {
  isEnd: boolean;
}

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements AfterViewInit {

  @Input() date: HTMLInputElement;
  @Input() time: HTMLInputElement;
  @Output() event: EventEmitter<boolean> = new EventEmitter<boolean>(false);

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

    const combineInputs$ = merge(
      fromEvent((this.date), 'change'),
      fromEvent((this.time), 'change')
    );

    combineInputs$
      .pipe(
        tap(_ => this.event.emit(false)),
        startWith(({ isEnd: false })),
        scan((acc, val) => ({ ...acc, ...val })),
        switchMap((state: State) => state.isEnd ? NEVER : this.interval$(state))
      )
      .subscribe();

  }

  interval$(state: State): Observable<number> {

    return interval(1000).pipe(
      // takeWhile(_ => !state.isEnd),
      tap(_ => {
        this.now = Date.now();
        this.then = new Date(`${this.date.value} ${this.time.value}`).getTime();
        this.diff = this.then - this.now;

        if (this.diff > 0) {
          this.calculateTimeUnits(this.diff);
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
    );
  }

  calculateTimeUnits(diff: number): void {
    this.days = this.calculateDays(diff);
    this.hours = this.calculateHours(diff);
    this.minutes = this.calculateMinutes(diff);
    this.seconds = this.calculateSeconds(diff);
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
