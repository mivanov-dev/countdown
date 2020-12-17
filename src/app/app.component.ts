import { Component, ElementRef, ViewChild } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Countdown';

  currentDate: string = moment(Date.now()).format('YYYY-MM-DD');
  currentTime: string = moment(Date.now()).format('HH:mm');
  isEnd = false;

  @ViewChild('date', { static: true }) date: ElementRef;
  @ViewChild('time', { static: true }) time: ElementRef;

  constructor() {
    setInterval(() => {
      this.currentDate = moment(Date.now()).format('DD-MM-YYYY');
      this.currentTime = moment(Date.now()).format('HH:mm:ss');
    }, 100);
  }

  handleEvent(event: boolean): void {
    this.isEnd = event;
  }

}
