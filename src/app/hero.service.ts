import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

import { Hero } from './hero';

export interface CachedResponse<T> {
  fetching: boolean;
  expiration: number;
  data: T;
}

@Injectable()
export class HeroService {

  private expireAfter = 5000; // data expire after this period of time (ms).

  private heroesSubject = new BehaviorSubject<CachedResponse<Hero[]>>({
    fetching: false,
    expiration: 0,
    data: undefined
  });

  private heroes = this.heroesSubject.asObservable();

  private url = 'hero.json';

  constructor(private http: Http) { }

  getHeroes(): Observable<CachedResponse<Hero[]>> {
    this.heroesSubject.do(pkg => {
      if (pkg.fetching) {
        console.log('fetching...');
      } else if (pkg.expiration > Date.now()) {
        console.log('returned cached because within expiration window');
      } else {
        // emit a new package with the same cached data that shows we're fetching
        const args = { ...pkg, ...{ fetching: true } };
        this.heroesSubject.next(args);

        // then get data from the server
        this.http.get(this.url).map(res => res.json())
          .map(data => ({
            fetching: false,
            expiration: Date.now() + this.expireAfter,
            data
          }))
          .do(newPkg => console.log('fetched data', newPkg))
          .subscribe(
            newPkg => this.heroesSubject.next(newPkg)
            // Todo: add error handling; set fetching false!
          );
      }
    })
    .first() // execute only once; the returned value is irrelevant
    .subscribe();

    return this.heroes;
  }
}
