import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { Hero, DataService } from './data.service';

@Component({
  selector: 'app-heroes',
  template: `
  <ng-template #noHeroes>
    <md-progress-bar class="progress" color="accent" mode="indeterminate"></md-progress-bar>
  </ng-template>

  <h2 md-header>{{title}}</h2>
  <div *ngIf="heroes;else noHeroes">
    <md-list>
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
export class HeroesComponent implements OnInit, OnDestroy {
  title = 'Heroes';
  heroes: Hero[];
  selectedHero: Hero;

  // Prevent memory leaks with the subject/takeUntil pattern
  // This is best when the component has multiple subscribes
  private onDestroy = new Subject();

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getHeroes()
      .takeUntil(this.onDestroy)
      .subscribe(heroes => this.heroes = heroes);
  }

  ngOnDestroy() {
    this.onDestroy.next();
  }

  refresh() {
    this.dataService.refreshHeroes();
  }

  selectHero(hero: Hero) {
    this.selectedHero = hero;
  }
}
