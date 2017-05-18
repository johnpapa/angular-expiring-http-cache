import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Villain, DataService } from './data.service';

@Component({
  selector: 'app-villains',
  template: `
    <ng-template #noVillains>
      <md-progress-bar class="progress" color="accent" mode="indeterminate"></md-progress-bar>
    </ng-template>

    <div *ngIf="villains;else noVillains">
      <md-list>
        <h2 md-header>{{title}}</h2>
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
export class VillainsComponent implements OnInit {
  title = 'Villains';
  villains: Villain[];
  selectedVillain: Villain;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getVillains()
      .subscribe(pkg => this.villains = pkg.data);
  }

  selectVillain(villain: Villain) {
    this.selectedVillain = villain;
    console.log(villain);
  }
}
