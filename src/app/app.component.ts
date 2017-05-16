import { Component, OnDestroy, OnInit } from '@angular/core';
import { Http } from '@angular/http';

import { expiringCacher } from './expiry-cacher';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  template: `
  <h1>RxJS Expiring Cacher</h1>
  <p>Look for output in browser console</p>
  <ul>
    <li *ngFor="let hero of heroes | async">{{hero.name}}</li>
  </ul>

  <pre>{{heroes | async | json}}</pre>
  `
})
export class AppComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject();

  heroes: any; // Observable<any[]>;

  constructor(private http: Http) { }

  ngOnInit() {
    this.heroes = this.http.get('hero.json')
      .map(res => res.json())
      .let(expiringCacher);
    // .takeUntil(this.onDestroy);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }
}
