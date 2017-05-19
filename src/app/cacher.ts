import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';

/////// CachedResponse<T> ////////

/** CachedResponse returned by Cacher `get` methods. */
export class CachedResponse<T> {
  /** Error from source if it fails */
  error: any = undefined;

  /** True if a "fetch" (execution of the source) is in progress. */
  fetching = false;

  constructor(public data: T, public expiration: number = 0) { }
}

/////// Cacher ////////

export class Cacher<T> {

  /** Cached values expire after this period (ms) by default */
  static defaultExpirationPeriod = 30000;

  /** Whether to log Cacher activity to console. For debugging/demos. */
  static verbose = false;

  /** Observable representation of the private caching subject */
  private readonly cache: Observable<CachedResponse<T>>;

  /**
   * Create instance of a Cacher which can cache and refresh an observable of type T
   *
   * @param {Observable<T>} source The observable source of values of type T
   * @param { BehaviorSubject<CachedResponse<T>>} [subject] Optional subject that maintains cached value;
   *  Creates its own subject if not defined.
   * @param { number } expireAfter Cached values expire after this period.
   *   Default is `Cacher.defaultExpirationPeriod`.
   */
  static create<T>(
    source: Observable<T>,
    subject?: BehaviorSubject<CachedResponse<T>>,
    expireAfter = Cacher.defaultExpirationPeriod
  ): Cacher<T> {

    if (!subject) {
      subject = new BehaviorSubject<CachedResponse<T>>(new CachedResponse<T>(undefined));
    }

    // execute do() once for its potential side-effect:
    // running source again once and updating the subject with its value
    const getFromCacheOrSource = (force: boolean) =>
      subject
        .do(cr => {
          if (cr.fetching || (!force && cr.expiration > Date.now())) {
            log(cr.fetching ? 'Fetching ...' : 'Using cached data');
            return;
          }

          // emit the same cached data but show we're fetching
          subject.next({ ...cr, ...{ fetching: true } });

          source
            .first() // ensure only execute source once
            .subscribe(data => {
              const newCr = new CachedResponse<T>(data, Date.now() + expireAfter);
              log('Fetched fresh data', newCr);
              return subject.next(newCr);
            },
            error => subject.next({ ...cr, ...{ fetching: false, error } }),
            () => log('Fetch observable completed')
            );
        })
        // execute do() only once; the returned value is irrelevant
        .first()
        .subscribe(null, null, () => log('getFromCacheOrSource completed'));

    return new Cacher(source, subject, expireAfter, getFromCacheOrSource);
  }

  private constructor(
    public readonly source,
    private readonly subject: BehaviorSubject<CachedResponse<T>>,
    public readonly expireAfter,
    private readonly getFromCacheOrSource: (force: boolean) => Subscription
  ) {
    this.cache = subject.asObservable(); // because shouldn't expose subject directly
  }

  /**
   *  Returns the observable of cached values (which a future call of `get()` may update)
   */
  getFromCache(): Observable<CachedResponse<T>> { return this.cache; }

  /**
   * Returns the observable of cached values.
   * It also initiates a fetch from source if the cached value expired.
   * Can force a fetch even if the cached value has not expired.
   *
   * @param {boolean} [force=false] forces a fetch that updates the cached observable.
   */
  get(force = false): Observable<CachedResponse<T>> {
    this.getFromCacheOrSource(force);
    return this.getFromCache();
  };
}

function log(...args) {
  if (Cacher.verbose) { console.log.apply(null, args); }
}
