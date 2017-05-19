import { Injectable, OnDestroy } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/timer';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/takeUntil';

import { Cacher } from './cacher';

@Injectable()
export class CountDownService implements OnDestroy {

  onDestroy = new Subject();

  heroCountDown = new BehaviorSubject(0);
  private heroCountDownStarted = false;

  hero2CountDown = new BehaviorSubject(0);
  private hero2CountDownResetSubject = new Subject();
  private hero2CountDownStarted = false;

  villainCountDown = new BehaviorSubject(0);
  private villainCountDownStarted = false;


  ngOnDestroy() {
    this.onDestroy.next();
  }

  startHero2Counter() {
    // only start it once
    if (!this.hero2CountDownStarted) {
      this.hero2CountDownStarted = true;

      Observable.timer(0, 1000)
        .filter(i => i <= 30)
        .map(i => this.hero2CountDown.next(30 - i))
        .takeUntil(this.hero2CountDownResetSubject)
        .repeat()
        .takeUntil(this.onDestroy)
        .subscribe();
    }
    return this.hero2CountDownResetSubject;
  }

  hero2CountDownReset = () => this.hero2CountDownResetSubject.next();

  startHeroCounter(heroCacher: Cacher<any>) {
    // only start it once
    if (this.heroCountDownStarted) { return; }
    this.heroCountDownStarted = true;
    this.startCounter(heroCacher, this.heroCountDown);
  }

  startVillainCounter(villainCacher: Cacher<any>) {
    // only start it once
    if (this.villainCountDownStarted) { return; }
    this.villainCountDownStarted = true;
    this.startCounter(villainCacher, this.villainCountDown);
  }

  /////////////////

  private startCounter(cacher: Cacher<any>, countDown: Subject<number>) {
    const reset = new Subject();
    const expireAfter = cacher.expireAfter / 1000;

    Observable.timer(0, 1000)
      .filter(i => i <= expireAfter)
      .map(i => countDown.next(expireAfter - i))
      .takeUntil(reset)
      .repeat()
      .takeUntil(this.onDestroy)
      .subscribe();

    cacher.getFromCache()
      .do(cr => cr.fetching && reset.next())
      .takeUntil(this.onDestroy)
      .subscribe();
  }

}
