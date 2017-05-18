import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Hero, HeroService } from '../hero.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  heroes: Observable<Hero[]>;

  constructor(private heroService: HeroService) { }

  ngOnInit() {
    this.heroes = this.heroService.refreshHeroes().map(pkg => pkg.data);
  }
}
