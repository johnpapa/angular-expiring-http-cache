import { Component, OnDestroy, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/takeUntil';

import { expiringCacher } from './expiry-cacher';
import { ExpiringMessage } from './expiring-message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject();

  heroes: Observable<any[]>;
  message: ExpiringMessage;

  constructor(private http: Http) { }

  ngOnInit() {
    this.heroes = this.http.get('hero.json')
      .map(response => response.json())
      .let(expiringCacher)
      .map(response => {
        this.message = response;
        return response.data;
      });
    // .takeUntil(this.onDestroy);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  refresh() {
    console.log('Expiring and refreshing the data');
  }

  expire() {
    console.log('Expiring the data, only');
  }
}
