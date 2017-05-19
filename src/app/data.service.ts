import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';

import { Cacher } from './cacher';
import { demandCacher } from './cacher2';

import { CountDownService } from './countdown.service';

export class Hero {
  constructor(public id: number, public name: string) { }
}

export class Villain {
  constructor(public id: number, public name: string) { }
}

@Injectable()
export class DataService {
  private heroCacher: Cacher<Hero[]>;
  private villainCacher: Cacher<Villain[]>;

  private nextHero = new ReplaySubject<boolean>();
  private hero2: Observable<Hero[]>;
  private hero2Started = false;

  constructor(
    private countdownService: CountDownService,
    private http: Http) {

    Cacher.verbose = true; // So we can toggle console logs

    const villainSource = <Observable<Villain[]>>this.http.get(`/villains.json`)
      .delay(5000) // simulate latency
      .map((response: Response) => response.json());

    const heroSource = <Observable<Hero[]>>this.http.get(`/heroes.json`)
      .map((response: Response) => response.json());

    this.villainCacher = new Cacher<Villain[]>(villainSource);
    this.heroCacher = new Cacher<Hero[]>(heroSource);

    this.hero2 = demandCacher(
      heroSource,
      this.nextHero,
      countdownService.hero2CountDownReset);
  }

  getHeroes2(force = false) {
    this.countdownService.startHero2Counter();
    force = force || !this.hero2Started;
    this.hero2Started = true;
    this.nextHero.next(force);
    return this.hero2;
  }

  getHeroes(force = false) {
    this.countdownService.startHeroCounter(this.heroCacher);

    return this.heroCacher.get(force)
        .filter(cr => !cr.fetching)
        .map(cr => cr.data);
  }

  getVillains(force = false) {
    this.countdownService.startVillainCounter(this.villainCacher);

    return this.villainCacher.get(force)
      .filter(cr => !cr.fetching)
      .map(cr => cr.data);
  }
}
