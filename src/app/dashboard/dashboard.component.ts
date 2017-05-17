import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

//////////////
// These observable imports are only needed for the counter
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/repeat';
//////////////

import { CachedResponse } from '../expiring-models';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject();
  private onResetCounter = new Subject();

  heroPackage: Observable<CachedResponse<Hero[]>>;

  counter: Observable<number>;
  lastExp: number;

  heroes: Observable<Hero[]>;

  constructor(private heroService: HeroService) { }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  ngOnInit() {
    this.heroPackage = this.heroService.getHeroes();
    this.heroes = this.heroPackage.map(pkg => pkg.data);

    this.counter = Observable.timer(0, 1000).takeUntil(this.onResetCounter).repeat();
  }

  refreshPackage() {
    // The next line alone is sufficient to refresh expired heroes
    // We use a new pkg constant just to show the differences in the console.log, below
    const pkg = this.heroService.getHeroes();

    // To make a point ...
    console.log('getHeroes() returns the same object as before: ' + (pkg === this.heroPackage));

    // All of the following nonsense is just about detecting
    // when the heroService actually fetches again
    // in order to reset the counter showing time since last actual refresh
    pkg.do(p => this.lastExp || (this.lastExp = p.expiration))
      .filter(p => this.lastExp === p.expiration ?
        false : !!(this.lastExp = p.expiration))
      .takeUntil(this.onDestroy)
      .subscribe(() => this.onResetCounter.next());
  }

}
