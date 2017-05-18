import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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

  constructor(private http: Http) {
    Cacher.verbose = true; // So we can toggle console logs

    const villainSource = <Observable<Villain[]>>this.http.get(`/villains.json`)
      .map((response: Response) => response.json());

    const heroSource = <Observable<Hero[]>>this.http.get(`/heroes.json`)
      .map((response: Response) => response.json());

    this.villainCacher = Cacher.create<Villain[]>(villainSource);
    this.heroCacher = Cacher.create<Hero[]>(heroSource);
  }

  getVillains() {
    this.villainCacher.refresh();
    return this.villainCacher.observable.filter(p => !p.fetching);
  }

  getHeroes() {
    this.heroCacher.refresh();
    return this.heroCacher.observable.filter(p => !p.fetching);
  }
}
