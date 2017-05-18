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

  observable: Observable<CachedResponse<T>>;

  refresh: () => void;

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
    const refresh = () =>
      subject
        .do(pkg => {
          if (pkg.fetching || pkg.expiration > Date.now()) {
            log(pkg.fetching ? 'Fetching ...' : 'Using cached data');
            return;
          }

          // emit a new package with the same cached data that shows we're fetching
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
        .subscribe(null, null, () => log('refresh completed'));

    return {
      refresh,
      observable: subject.asObservable()
    };
  }
}

function log(...args) {
  if (Cacher.verbose) { console.log.apply(null, args); }
}
