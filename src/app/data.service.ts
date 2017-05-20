import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { combineLatest} from 'rxjs/observable/combineLatest';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';

import { Cacher } from './cacher';
import { createOnDemandCache } from './caching-fns';

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

  /** Observable is true if any of the cached sources is fetching */
  isFetching: Observable<boolean>;

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
        .delay(3000) // simulate network/server latency
        .map((response: Response) => response.json());
    // ****************************************

    this.heroCacher = new Cacher(heroSource);
    this.villainCacher = new Cacher(villainSource);

    this.isFetching = combineLatest(
      this.heroCacher.notifications,
      this.villainCacher.notifications,
      (h, v) => h.type === 'fetching' || v.type === 'fetching'
    );
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
