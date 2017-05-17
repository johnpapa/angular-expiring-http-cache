export interface CachedResponse<T> {
  fetching: boolean;
  expiration: number;
  data: T;
}

export class ExpiringMessage {
  constructor(public data: Array<Object>, public stamp: number) { }
}

export class CachePackage {
  constructor(public fetching: boolean = false, public expiration = 0, public data = undefined) { }
}

// export let cachePackageFactory = () => new CachePackage();

