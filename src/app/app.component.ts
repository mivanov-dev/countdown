import { Component, ElementRef, ViewChild } from '@angular/core';

import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Countdown';

  currentDateTime: string;
  isEnd = false;

  @ViewChild('date', { static: true }) date: ElementRef;
  @ViewChild('time', { static: true }) time: ElementRef;

  constructor() {
    interval(100).subscribe(_ => this.currentDateTime = Date.now().toString());
  }

  handleEvent(event: boolean): void {
    this.isEnd = event;
  }

}
