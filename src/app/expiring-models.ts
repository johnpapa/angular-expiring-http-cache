import { CachedResponse } from './cacher';
export { CachedResponse }; // for now.

export class ExpiringMessage {
  constructor(public data: Array<Object>, public stamp: number) { }
}

export class CachePackage {
  constructor(public fetching: boolean = false, public expiration = 0, public data = undefined) { }
}
