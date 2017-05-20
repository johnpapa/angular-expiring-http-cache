import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Villain, DataService } from './data.service';

@Component({
  selector: 'app-villains',
  template: `
    <h2 md-header>{{title}}</h2>
    <md-list>
      <md-list-item *ngFor="let villain of villains"
        [class.selected]="selectedVillain === villain"
        (click)="selectVillain(villain)">
        <p md-line>
          <span>{{villain.name}}</span>
        </p>
      </md-list-item>
    </md-list>
  `
})
export class VillainsComponent implements OnInit, OnDestroy {
  title = 'Villains';
  villains: Villain[];
  selectedVillain: Villain;

  // Prevent memory leaks with the unsubscribe pattern
  // This is best when the component has only one subscribe
  private subscription: Subscription;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.subscription = this.dataService.getVillains()
      .subscribe(villains => this.villains = villains);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  selectVillain(villain: Villain) {
    this.selectedVillain = villain;
    console.log(villain);
  }
}
