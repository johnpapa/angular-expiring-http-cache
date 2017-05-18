import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Hero, HeroService } from '../hero.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  heroes: Observable<Hero[]>;

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroes = this.heroService.refreshHeroes().map(pkg => pkg.data);
  }
}
