import { Component } from '@angular/core';
import { DataService } from './data.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  template: `
  <div>
    <md-progress-bar *ngIf="isFetching | async" color="accent" mode="indeterminate"></md-progress-bar>
    <app-nav></app-nav>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
  </div>
  `
})
export class AppComponent {
  isFetching: Observable<boolean>;

  constructor(dataService: DataService) {
    this.isFetching = dataService.isFetching;
  }
}
