import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';

import { Cacher } from './cacher';
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

    Cacher.verbose = true; // So we can toggle console logs

    const villainSource = <Observable<Villain[]>>this.http.get(`/villains.json`)
      .map((response: Response) => response.json());

    const heroSource = <Observable<Hero[]>>this.http.get(`/heroes.json`)
      .map((response: Response) => response.json());

    this.villainCacher = Cacher.create<Villain[]>(villainSource);
    this.heroCacher = Cacher.create<Hero[]>(heroSource);
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
