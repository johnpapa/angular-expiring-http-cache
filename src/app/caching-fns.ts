import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/observable/timer';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

/* Whether to log caching activity to console. For debugging/demos. */
export let _verbose = true;
export function setVerbose(value: boolean) { _verbose = value; }

/** Cached values expire after this period (ms) by default */
export const defaultExpirationPeriod = 3000;

/**
 * Cache values and update from source whenever next emits
 * @param {Observable<T>} source
 * @param {Observable<any>} next
 */
export function cache<T>(source: Observable<T>, next: Observable<any>) {
  const cacheSubject = new ReplaySubject(1);

  // get from the source whenever `next` emits
  next
  .switchMap(() => source.first())
  .subscribe(
     data => cacheSubject.next(data)
    // Todo: add error handling
  );

  return cacheSubject.asObservable();
};

/*
 * Invoke async observable source (e.g., HTTP call), cache the result
 * and then refresh the cached value from a new HTTP call periodically
 * with a timer that ticks every `expirationPeriod` ms.
 *
 * Example:
 *
 *   const cachingRequest = this.http.get('hero.json')
 *     .map(res => res.json().data)
 *     .let(timerCache());
 *
 *   cachingRequest.subscribe(data => ... do something ...);
 */
export function timerCache<T>(expirationPeriod = defaultExpirationPeriod) {
  return (source: Observable<T>) =>
    cache(
      source,
      Observable.timer(0, expirationPeriod)
        .do(count => log('source executed #' + count))
    );
}

/*
 * Cache values from an async source (e.g., HTTP call) in an observable.
 *
 * Update cache from the source on demand based on update observable events.
 * Cache updates if the cached value has expired or update emits true (force update).
 *
 * Example:
 *
 *   // async source of values
 *   const source = this.http.get('hero.json')
 *     .map(res => res.json().data);
 *
 *   // subject that controls when and how to update the cache
 *   const updateSubject = new ReplaySubject<boolean>(1);
 *
 *   // create the onDemand caching observable, controlled by the updateSubject
 *   // updateSubject is also the update observable
 *   const example = onDemandCache(source, updateSubject);
 *
 *   // sequence of cached values
 *   example.subscribe(data => ...);
 *
 *   // update helper method
 *   const update(force = false) => updateSubject.next(force);
 *
 *   // force an update of the cache from source
 *   update(true);
 *
 *   // update cache from source if expired
 *   update();
 *
 * @param {Observable<T>} source Async source of values
 * @param {Observable<boolean>} update The "demand" observable that may update the cache
 * @param {Function} [fetched] Optional function called when cache has fetched from the source
 * @param {number} [expirationPeriod=defaultExpirationPeriod] Expiration window.
 */
export function onDemandCache<T> (
    source: Observable<T>,
    update: Observable<boolean>,
    fetched?: () => void,
    expirationPeriod?: number
  ): Observable<T> {
    let expired = 0;
    let firstTime = true;

    if (!fetched) { fetched = () => {}; }
    expirationPeriod = (expirationPeriod == null) ? defaultExpirationPeriod : expirationPeriod;

    return cache(
      source.do(data => {
        expired = Date.now() + expirationPeriod;
        log('Fetched ', data);
        fetched();
      }),

     update
      .map(force => firstTime || force || expired < Date.now())
      .filter(fetch => {
        firstTime = false;
        log( fetch ? 'Fetching...' : 'Use cached value');
        return fetch;
      })
    );
};

// logger logs to console when verbose == true
function log(...args) {
  if (_verbose) { console.log.apply(null, args); }
}
