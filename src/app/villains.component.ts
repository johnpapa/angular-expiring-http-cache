import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Villain, DataService } from './data.service';

@Component({
  selector: 'app-villains',
  template: `
    <ng-template #noVillains>
      <md-progress-bar class="progress" color="accent" mode="indeterminate"></md-progress-bar>
    </ng-template>

    <h2 md-header>{{title}}</h2>
    <div *ngIf="villains;else noVillains">
      <md-list>
        <md-list-item *ngFor="let villain of villains"
          [class.selected]="selectedVillain === villain"
          (click)="selectVillain(villain)">
          <p md-line>
            <span>{{villain.name}}</span>
          </p>
        </md-list-item>
      </md-list>
    </div>
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
