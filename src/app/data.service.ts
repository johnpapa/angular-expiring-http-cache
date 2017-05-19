import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/share';

import { Cacher } from './cacher';

export class Hero {
  constructor(public id: number, public name: string) { }
}

export class Villain {
  constructor(public id: number, public name: string) { }
}

@Injectable()
export class DataService {
  private villainCacher: Cacher<Villain[]>;
  private heroCacher: Cacher<Hero[]>;

  private heroCounterReset = new Subject();
  private villainCounterReset = new Subject();

  heroCountDown = Observable.interval(1000)
    .map(i => (this.heroCacher.expireAfter / 1000) - i)
    .takeUntil(this.heroCounterReset)
    .repeat()
    .share();

  villainCountDown = Observable.interval(1000)
    .map(i => (this.villainCacher.expireAfter / 1000) - i)
    .takeUntil(this.villainCounterReset)
    .repeat()
    .share();

  constructor(private http: Http) {
    Cacher.verbose = true; // So we can toggle console logs

    const villainSource = <Observable<Villain[]>>this.http.get(`/villains.json`)
      .map((response: Response) => response.json());

    const heroSource = <Observable<Hero[]>>this.http.get(`/heroes.json`)
      .map((response: Response) => response.json());

    this.villainCacher = Cacher.create<Villain[]>(villainSource);
    this.heroCacher = Cacher.create<Hero[]>(heroSource);
  }

  getHeroes(force = false) {
    return this.heroCacher.get(force)
      .do(cr => cr.fetching && this.heroCounterReset.next())
      .filter(cr => !cr.fetching)
      .map(cr => cr.data);
  }

  getVillains(force = false) {
    return this.villainCacher.get(force)
    .do(cr => cr.fetching && this.villainCounterReset.next())
    .filter(cr => !cr.fetching)
    .map(cr => cr.data);
  }
}
