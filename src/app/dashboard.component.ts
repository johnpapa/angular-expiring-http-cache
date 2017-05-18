import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Hero, HeroService } from './hero.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <h2>Dashboard Heroes</h2>
    <i>Refreshes when created.</i>
    <ul>
      <li *ngFor="let hero of heroes | async">{{hero.name}}</li>
    </ul>
  `
})
export class DashboardComponent implements OnInit {
  heroes: Observable<Hero[]>;

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroes = this.heroService.refreshHeroes().map(pkg => pkg.data);
  }
}
