import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { CountDownService } from './countdown.service';
import { DataService } from './data.service';

@Component({
  selector: 'app-cache-countdown',
  template: `
      <div class="counter">
        <button  md-button (click)="force()">Refresh All</button>
        <span fxFlex="grow">Caching: heroes for {{hero2CountDown | async}} s,</span>
        <span fxFlex>Caching villains for {{villainCountDown | async}} s</span>
      </div>
  `
})
export class CountDownComponent implements OnInit {
  heroCountDown: Observable<number>;
  hero2CountDown: Observable<number>;
  villainCountDown: Observable<number>;

  constructor(
    private countDownService: CountDownService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.heroCountDown = this.countDownService.heroCountDown;
    this.hero2CountDown = this.countDownService.hero2CountDown;
    this.villainCountDown = this.countDownService.villainCountDown;
  }

  force() {
    this.dataService.getHeroes(true);
    this.dataService.getHeroes2(true);
    this.dataService.getVillains(true);
  }
}
