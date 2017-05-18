import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';

export class CachedResponse<T> {
  error: any = undefined;
  fetching = false;

  constructor(public data: T, public expiration: number = 0) { }
}

export class Cacher<T> {
  static defaultExpirationWindow = 30000;
  static verbose = true;


/**
 * Returns the observable of cached values.
 * It also initiates a fetch if the cached value expired.
 * Can force a fetch even if the cached value has not expired.
 *
 * @param {boolean} [force=false] forces a fetch that updates the cached value.
 */
  get: (forceFetch?: boolean) => void;

/**
 *  Returns the observable of cached values (which some future call of `get` will update)
 */
  getCached: () => Observable<CachedResponse<T>>;

  static create<T>(
    source: Observable<T>,
    subject?: BehaviorSubject<CachedResponse<T>>,
    expireAfter = Cacher.defaultExpirationWindow
  ): Cacher<T> {

    if (!subject) {
      subject = new BehaviorSubject<CachedResponse<T>>(new CachedResponse<T>(undefined));
    }

    // execute do() once for its potential side-effect:
    // running source again once and updating the subject with its value
    const get = (force = false) =>
      subject
        .do(pkg => {
          if (pkg.fetching || (!force && pkg.expiration > Date.now())) {
            log(pkg.fetching ? 'Fetching ...' : 'Using cached data');
            return;
          }

          // emit the same cached data but show we're fetching
          subject.next({ ...pkg, ...{ fetching: true } });

          source
            .first() // ensure only execute source once
            .subscribe(data => {
              const newPkg = new CachedResponse<T>(data, Date.now() + expireAfter);
              log('Fetching fresh data ...', newPkg);
              return subject.next(newPkg);
            },
            error => subject.next({ ...pkg, ...{ fetching: false, error } }),
            () => log('Fetch completed')
            );
        })
        // execute do() only once; the returned value is irrelevant
        .first()
        .subscribe(
          null, // x => log('get next', x),
          null,
          () => log('get completed')
        );

    return {
      get,
      getCached: () => subject
    };
  }
}

function log(...args) {
  if (Cacher.verbose) { console.log.apply(null, args); }
}
