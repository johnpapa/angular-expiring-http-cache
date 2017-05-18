import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Hero, HeroService } from './hero.service';

@Component({
  selector: 'app-heroes',
  template: `
    <h2>Heroes Heroes</h2>
    <i>Does not refresh when created.</i>
    <ul>
      <li *ngFor="let hero of heroes | async">{{hero.name}}</li>
    </ul>
  `
})
export class HeroesComponent implements OnInit {
  heroes: Observable<Hero[]>;

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    // Does not refresh!
    this.heroes = this.heroService.heroes.map(pkg => pkg.data);
  }
}
