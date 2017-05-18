import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <h1>RxJS Expiring Cacher</h1>
    <nav>
      <a href="" routerLink="/">Dashboard</a>
      <a href="" routerLink="/heroes">Heroes</a>
    </nav>
    <hr>
    <router-outlet></router-outlet>
    <hr>
    <cache-counter></cache-counter>
  `
})
export class AppComponent { }
