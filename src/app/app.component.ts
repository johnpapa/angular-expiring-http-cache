import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Http } from '@angular/http';

import { Hero } from './hero';
import { HeroService, cachedResponse } from './hero.service';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

// These observable imports are only needed for the counter
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/repeat';

// Old stuff
// None of these observable imports are needed when using HeroService
// import 'rxjs/add/operator/let';


// import { expiringCacher } from './expiry-cacher';
// import { ExpiringMessage } from './expiring-message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject();
  private onResetCounter = new Subject();

  heroPkg: Observable<cachedResponse<Hero[]>>;

  counter: Observable<number>;
  lastExp: number;

  heroes: Observable<Hero[]>;
  // message: ExpiringMessage;

  constructor(
    // private http: Http,
    private heroService: HeroService) { }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  ngOnInit() {
    this.heroPkg = this.heroService.getHeroes();
    this.heroes = this.heroPkg.map(pkg => pkg.data);

    this.counter = Observable.timer(0, 1000).takeUntil(this.onResetCounter).repeat();

    // this.heroes = this.http.get('hero.json')
    //   .map(response => response.json())
    //   .let(expiringCacher)
    //   .map(response => {
    //     this.message = response;
    //     return response.data;
    //   });
    // // .takeUntil(this.onDestroy);
  }

  // expire() {
  //   console.log('Expiring the data, only');
  // }

  // refresh() {
  //   console.log('Expiring and refreshing the data');
  // }

  refreshPkg() {
    // The next line alone is sufficient to refresh expired heroes
    const pkg = this.heroService.getHeroes();

    // To make a point ...
    console.log('getHeroes() returns the same object as before: ' + (pkg === this.heroPkg));

    // All of the following nonsense is just about detecting
    // when the heroService actually fetches again
    // in order to reset the counter showing time since last actual refresh
    pkg.do(p => this.lastExp ||  (this.lastExp = p.expiration))
      .filter(p => this.lastExp === p.expiration ?
         false : !!(this.lastExp = p.expiration))
      .takeUntil(this.onDestroy)
      .subscribe(() => this.onResetCounter.next());
  }

}
