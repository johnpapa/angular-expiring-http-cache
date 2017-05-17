import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/first';

export interface CachedResponse<T> {
  fetching: boolean;
  expiration: number;
  data: T;
  error: any;
}

export class Cacher<T> {
  static defaultExpirationWindow = 5000;

  observable: Observable<CachedResponse<T>>;

  refresh: () => void;

  static create<T>(
    source: Observable<T>,
    subject?: BehaviorSubject<CachedResponse<T>>,
    expireAfter = Cacher.defaultExpirationWindow
  ): Cacher<T> {

    if (!subject) {
      subject = new BehaviorSubject<CachedResponse<T>>({
        fetching: false,
        expiration: 0,
        data: undefined,
        error: undefined
      });
    }

    // execute do() once for its potential side-effect:
    // running source again once and updating the subject with its value
    const refresh = () =>
      subject.do(pkg => {
        if (pkg.fetching || pkg.expiration > Date.now()) {
          // do nothing because fetching or cached data is unexpired
          return;
        }
        // emit a new package with the same cached data that shows we're fetching
        subject.next({ ...pkg, ...{ fetching: true } });

        // then get data from the source
        source
          .first() // ensure only execute source once
          .subscribe(
            data => subject.next({
              fetching: false,
              expiration: Date.now() + expireAfter,
              data,
              error: undefined}),
            error => subject.next({ ...pkg, ...{ fetching: false, error}})
          );
      })
      // execute do() only once; the returned value is irrelevant
      .first()
      .subscribe();

    return {refresh, observable: subject.asObservable()};
  }
}
