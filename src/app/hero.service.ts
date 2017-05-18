import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';

import { Cacher } from './cacher';
import { Hero } from './hero';
export { Hero }

@Injectable()
export class HeroService {
  private heroesCacher: Cacher<Hero[]>;
  private url = 'hero.json';

  constructor(private http: Http) {
    const source = this.http.get(this.url).map(res => res.json());
    Cacher.verbose = false; // So we can toggle console logs
    this.heroesCacher = Cacher.create<Hero[]>(source);
  }

  refreshHeroes() {
    this.heroesCacher.refresh();
    return this.heroesCacher.observable;
  }

  get heroes() {
    return this.heroesCacher.observable;
  }
}
