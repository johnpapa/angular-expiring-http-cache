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

  private heroCountDownStarted = false;
  private villainCountDownStarted = false;

  heroCountDown = new BehaviorSubject(0);
  villainCountDown = new BehaviorSubject(0);

  private heroCountDownResetSubject = new Subject();
  private villainCountDownResetSubject = new Subject();

  heroCountDownReset = () => this.heroCountDownResetSubject.next();
  villainCountDownReset = () => this.villainCountDownResetSubject.next();

  ngOnDestroy() {
    this.onDestroy.next();
  }

  startHeroCounter(heroCacher: Cacher<any>) {
    // only start it once
    if (this.heroCountDownStarted) { return; }
    this.heroCountDownStarted = true;
    this.startCounter(heroCacher, this.heroCountDown, this.heroCountDownResetSubject);
  }

  startVillainCounter(villainCacher: Cacher<any>) {
    // only start it once
    if (this.villainCountDownStarted) { return; }
    this.villainCountDownStarted = true;
    this.startCounter(villainCacher, this.villainCountDown, this.villainCountDownResetSubject);
  }

  /////////////////

  private startCounter(cacher: Cacher<any>, countDown: Subject<number>, reset: Observable<any>) {
    const expireAfter = cacher.expirationPeriod / 1000;

    Observable.timer(0, 1000)
      .filter(i => i <= expireAfter)
      .map(i => countDown.next(expireAfter - i))
      .takeUntil(reset)
      .repeat()
      .takeUntil(this.onDestroy)
      .subscribe();
  }
}
