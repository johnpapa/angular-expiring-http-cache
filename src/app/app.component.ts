import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <div>
    <app-nav></app-nav>
    <div class="content">
      <router-outlet></router-outlet>
    </div>
    <app-footer></app-footer>
  </div>
  `
})
export class AppComponent { }
