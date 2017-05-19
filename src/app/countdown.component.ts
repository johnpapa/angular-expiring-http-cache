import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { CountDownService } from './countdown.service';

@Component({
  selector: 'app-cache-countdown',
  template: `
    <div>
      <h3>Hero Cache Countdown</h3>
      <div>Caching heroes for the next {{heroCountDown | async}} seconds</div>
      <h3>Villain Cache Countdown</h3>
      <div>Caching villains for the next {{villainCountDown | async}} seconds</div>
    </div>
  `
})
export class CountDownComponent implements OnInit {

  heroCountDown: Observable<number>;
  villainCountDown: Observable<number>;

  constructor(private countDownService: CountDownService) { }

  ngOnInit() {
    this.heroCountDown = this.countDownService.heroCountDown;
    this.villainCountDown = this.countDownService.villainCountDown;
  }
}
