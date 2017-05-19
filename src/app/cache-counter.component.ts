import { Component, OnInit, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { DataService } from './data.service';

@Component({
  selector: 'app-cache-counter',
  template: `
    <div>
      <h3>Hero Fetch Countdown</h3>
      <div>Since last fetch: {{heroCountDown | async}} seconds</div>
      <h3>Villain Fetch Countdown</h3>
      <div>Since last fetch: {{villainCountDown | async}} seconds</div>
    </div>
  `
})
export class CacheCounterComponent implements OnInit, OnDestroy {

  private onDestroy = new Subject();

  heroCountDown: Observable<number>;
  villainCountDown: Observable<number>;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.heroCountDown = this.dataService.heroCountDown.takeUntil(this.onDestroy);
    this.villainCountDown = this.dataService.villainCountDown.takeUntil(this.onDestroy);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
