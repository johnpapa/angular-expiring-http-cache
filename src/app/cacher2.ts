import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/timer';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

export let verbose = true;

export const defaultRefreshPeriod = 30000;  // default interval between async calls

export const cacher = (source: Observable<any>, next: Observable<any>) => {
  const cache = new ReplaySubject(1);

  next
  .switchMap(() => source.first())
  .subscribe(
    data => cache.next(data)
    // Todo: add error handling
  );

  return cache.asObservable();
};

/*
 * Invoke async observable source (e.g., HTTP call), cache the result
 * and then refresh the cached value from a new HTTP call periodically
 * (every `refreshPeriod` ms).
 *
 * Example:
 *
 *   const cachingRequest = this.http.get('hero.json')
 *     .map(res => res.json().data)
 *     .let(expiringCacher());
 *
 *   cachingRequest.subscribe(data => ... do something ...);
 */
export const expiringCacher = (refreshPeriod = defaultRefreshPeriod) =>
  (source: Observable<any>) =>
    cacher(
      source,
      Observable.timer(0, refreshPeriod)
        .do(count => log('source executed #' + count))
    );

/*
 * Cache values from an async source (e.g., HTTP call) in an observable.
 *
 * You can demand that the cache update from the source
 * if the cached value has expired or force it to update the cache
 * by calling next on a boolean ReplaySubject.
 *
 * Example:
 *
 *   // async source of values
 *   const source = this.http.get('hero.json')
 *     .map(res => res.json().data);
 *
 *   // Subject that may update the cache by executing the source
 *   const getNextSubject =  new ReplaySubject<boolean>(1);
 *
 *   const example = demandCacher(source, getNextSubject);
 *
 *   const getNext(force = false) => getNextSubject.next(force);
 *
 *   // sequence of cached values
 *   example.subscribe(data => ...);
 *
 *   // force an update of the cache from source
 *   getNext(true);
 *
 *   // update cache from source if expired
 *   getNext();
 *
 * @param {Observable<T>} source Async source of values
 * @param {Observable<boolean>} next The "demand" observable that triggers potential refresh
 * @param {Function} [fetched] Optional callback when cacher has fetched from the source
 * @param {number} [refreshPeriod=defaultRefreshPeriod] Expiration window.
 */
export function demandCacher<T> (
    source: Observable<T>,
    next: Observable<boolean>,
    fetched?: () => void,
    refreshPeriod?: number
  ): Observable<T> {
    let expired = 0;
    if (!fetched) { fetched = () => {}; }
    refreshPeriod = (refreshPeriod == null) ? defaultRefreshPeriod : refreshPeriod;

    return cacher(
      source.do(data => {
        expired = Date.now() + refreshPeriod;
        log('Fetched ', data);
        fetched();
      }),

     next
      .map(force => force || expired < Date.now())
      .filter(fetch => {
        log( fetch ? 'Fetching...' : 'Use cached value');
        return fetch;
      })
    );
};

// logger logs to console when verbose == true
function log(...args) {
  if (verbose) { console.log.apply(null, args); }
}
