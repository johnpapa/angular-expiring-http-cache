import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// These observable imports are only needed for the counter
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/repeat';

import { CachedResponse } from '../cacher';
import { Hero, HeroService } from '../hero.service';

@Component({
  selector: 'hero-counter',
  templateUrl: './counter.component.html'
})
export class CounterComponent implements OnInit {

  counter: Observable<number>;
  heroPackage: Observable<CachedResponse<Hero[]>>;
  lastExp: number;
  private onResetCounter = new Subject();

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroPackage = this.heroService.refreshHeroes();

    // Time since last actual refresh
    this.counter = Observable.timer(0, 1000).takeUntil(this.onResetCounter).repeat();

    // All of the following nonsense is just about detecting
    // when the heroService actually fetches again
    // in order to reset the counter showing time since last actual refresh
    this.heroPackage
      .do(p => this.lastExp || (this.lastExp = p.expiration))
      .filter(p => this.lastExp === p.expiration ? false : !!(this.lastExp = p.expiration))
      .subscribe(() => this.onResetCounter.next());
  }

  refreshPackage() {
    this.heroService.refreshHeroes();
  }
}
