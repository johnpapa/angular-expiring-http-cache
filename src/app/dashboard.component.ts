import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from './data.service';

@Component({
  selector: 'app-dashboard',
  template: `
    <div>
      <h2 md-header>{{title}}</h2>
    </div>
    TODO:Write up instructions on how this demo works
  `
})
export class DashboardComponent implements OnInit {
  title = 'Dashboard';

  constructor(private dataService: DataService) { }

  ngOnInit() {

  }
}
