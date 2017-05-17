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

import { ExpiringMessage } from './expiring-message';

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
      .do(response => console.log('asyncMethod call #' + count, response))
  )
  .map(response => {
    const message = new ExpiringMessage(response, new Date().getTime());
    console.log('Package being delivered:', message);
    return message;
  })
  .share();
