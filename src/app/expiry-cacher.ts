import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import 'rxjs/add/observable/timer';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/take';

const refreshDelay = 5000;  // interval between async calls
/*
 * Invoke async observable source (e.g., HTTP call), cache the result
 * and then refresh the cached value from a new HTTP call periodically
 * (every `refreshDelay` ms).
 *
 * Example:
 *
 *   const cachingRequest = this.http.get('hero.json')
 *     .map(res => res.json().data)
 *     .let(expiringCacher);
 *
 *   cachingRequest.subscribe(data => ... do something ...);
 */

export const expiringCacher = (source: Observable<any>) => Observable
  .timer(0, refreshDelay)
  .switchMap(count =>
    source
    // Todo: add error handling? Remove next logging line.
    .do(res => console.log('asyncMethod call #' + count, res) )
  )
  .share();


///////// Experiments

// Does something async in random time < 1 second
function asyncThing(count) {
  return Observable.timer(Math.random() * 1000)
    .do(() => console.log('asyncThing for ' + count))
    .map(() => count);
}

const fooDelay = 5000; // interval between async calls

export const foo = Observable
  .timer(0, refreshDelay)
  .switchMap(count =>  asyncThing(count))
  .share();

