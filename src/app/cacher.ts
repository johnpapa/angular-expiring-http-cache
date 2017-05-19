import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import * as cacheFns from './caching-fns';

export class Cacher<T> {

  /** Whether to log Cacher activity to console. For debugging/demos. */
  static get verbose() { return cacheFns._verbose; };
  static set verbose(value: boolean) { cacheFns.setVerbose(value); };

  /** Cached values expire after this period (ms) by default */
  static defaultExpirationPeriod = 30000;

  /** Observable of cached values */
  readonly cache: Observable<T>;

  private updateSubject = new Subject<boolean>();

  /**
   * Create instance of a Cacher which can cache and refresh an observable of type T
   *
   * @param {Observable<T>} source The observable source of values of type T
   * @param {Function} [fetched] Optional callback when cacher has fetched from the source
   * @param {number} [expirationPeriod=defaultExpirationPeriod] Expiration window.
   */
  constructor(
    public readonly source: Observable<T>,
    public fetched = () => {},
    public readonly expirationPeriod = Cacher.defaultExpirationPeriod
  ) {
    this.cache = cacheFns.createOnDemandCache(source, this.updateSubject, fetched, expirationPeriod);
  }

  /**
   * update cache by force or if the cache has expired.
   *
   * @param {boolean} [force=false] Whether to force update from source
   */
  update(force = false) {
    this.updateSubject.next(force);
  }
}
