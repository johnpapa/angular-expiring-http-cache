import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';

import { CachedResponse } from './expiring-models';

@Injectable()
export class CacherService {

  constructor(private http: Http) { }

  getData<T>(
    url: string,
    subject: BehaviorSubject<CachedResponse<T[]>>,
    expireAfter: number
  ): Observable<CachedResponse<T[]>> {
    const cachedData = subject.asObservable();
    subject.do(pkg => {
      if (pkg.fetching) {
        console.log('fetching...');
      } else if (pkg.expiration > Date.now()) {
        console.log('returned cached because within expiration window');
      } else {
        // emit a new package with the same cached data that shows we're fetching
        const args = { ...pkg, ...{ fetching: true } };
        subject.next(args);

        // then get data from the server
        this.http.get(url).map(res => res.json())
          .map(data => ({
            fetching: false,
            expiration: Date.now() + expireAfter,
            data
          }))
          .do(newPackage => console.log('fetched data', newPackage))
          .subscribe(
          newPackage => subject.next(newPackage)
          // Todo: add error handling; set fetching false!
          );
      }
    })
      .first() // execute only once; the returned value is irrelevant
      .subscribe();

    return cachedData;
  }
}
