import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CountDownService } from './countdown.service';

@Component({
  selector: 'app-cache-countdown',
  template: `
      <div class="">
        <span fxFlex="grow">Caching: heroes for {{heroCountDown | async}} s,</span>
        <span fxFlex>Caching villains for {{villainCountDown | async}} s</span>
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
