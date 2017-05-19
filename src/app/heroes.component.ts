import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Hero, DataService } from './data.service';

@Component({
  selector: 'app-heroes',
  template: `
  <ng-template #noHeroes>
    <md-progress-bar class="progress" color="accent" mode="indeterminate"></md-progress-bar>
  </ng-template>

  <div *ngIf="heroes;else noHeroes">
    <md-list>
      <h2 md-header>{{title}}</h2>
      <button md-button color="primary" (click)="refresh()">Refresh now</button>
      <md-list-item *ngFor="let hero of heroes"
        [class.selected]="hero===selectedHero"
        (click)="selectHero(hero)">
        <p md-line>
          <span>{{hero.name}}</span>
        </p>
      </md-list-item>
    </md-list>
  </div>
  `
})
export class HeroesComponent implements OnInit {
  title = 'Heroes';
  heroes: Hero[];
  selectedHero: Hero;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getHeroes().subscribe(heroes => this.heroes = heroes);
  }

  refresh() {
    this.dataService.getHeroes(true);
  }

  selectHero(hero: Hero) {
    this.selectedHero = hero;
  }
}
