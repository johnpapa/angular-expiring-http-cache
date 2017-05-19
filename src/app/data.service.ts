import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { Cacher } from './cacher';
import { onDemandCache } from './caching-fns';

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

  constructor(
    private countdownService: CountDownService,
    private http: Http) {

    Cacher.verbose = true; // So we can see console logs

    // ****************************************
    // TODO: add error handling to the sources
    const heroSource: Observable<Hero[]> =
      this.http.get(`/heroes.json`)
        .map((response: Response) => response.json());

    const villainSource: Observable<Villain[]> =
      this.http.get(`/villains.json`)
        .delay(5000) // simulate latency
        .map((response: Response) => response.json());
    // ****************************************

    this.heroCacher = new Cacher<Hero[]>(heroSource, countdownService.heroCountDownReset);
    this.villainCacher = new Cacher<Villain[]>(villainSource, countdownService.villainCountDownReset);
  }

  getHeroes(force = false) {
    this.countdownService.startHeroCounter(this.heroCacher);
    this.heroCacher.update(force);
    return this.heroCacher.cache;
  }

  refreshHeroes() {
    this.getHeroes(true);
  }

  getVillains(force = false) {
    this.countdownService.startVillainCounter(this.villainCacher);
    this.villainCacher.update(force);
    return this.villainCacher.cache;
  }
}
