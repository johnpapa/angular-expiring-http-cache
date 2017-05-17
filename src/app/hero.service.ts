import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { Hero } from './hero';
import { CachedResponse, CachePackage } from './expiring-models';
import { CacherService } from './cacher.service';

@Injectable()
export class HeroService {

  private heroCachePackage = new CachePackage();
  private expireAfter = 5000; // data expire after this period of time (ms).
  private heroesSubject = new BehaviorSubject<CachedResponse<Hero[]>>(this.heroCachePackage);

  private heroes = this.heroesSubject.asObservable();

  private url = 'hero.json';

  constructor(private http: Http, private cacherService: CacherService) { }

  getHeroes() {
    return this.cacherService.getData(this.url, this.heroesSubject, this.expireAfter);
  }
}

///////////////
// Now abstracted to CacherService
// import { Observable } from 'rxjs/Observable';
// import 'rxjs/add/operator/do';
// import 'rxjs/add/operator/first';
// import 'rxjs/add/operator/map';
//
// getHeroes_original(): Observable<CachedResponse<Hero[]>> {
//   this.heroesSubject.do(pkg => {
//     if (pkg.fetching) {
//       console.log('fetching...');
//     } else if (pkg.expiration > Date.now()) {
//       console.log('returned cached because within expiration window');
//     } else {
//       // emit a new package with the same cached data that shows we're fetching
//       const args = { ...pkg, ...{ fetching: true } };
//       this.heroesSubject.next(args);

//       // then get data from the server
//       this.http.get(this.url).map(res => res.json())
//         .map(data => ({
//           fetching: false,
//           expiration: Date.now() + this.expireAfter,
//           data
//         }))
//         .do(newPkg => console.log('fetched data', newPkg))
//         .subscribe(
//         newPkg => this.heroesSubject.next(newPkg)
//         // Todo: add error handling; set fetching false!
//         );
//     }
//   })
//     .first() // execute only once; the returned value is irrelevant
//     .subscribe();

//   return this.heroes;
// }
///////////////
