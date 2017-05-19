import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `
    <div>
      <h2 md-header>{{title}}</h2>
    </div>
    TODO: Write instructions on how this demo works
  `
})
export class DashboardComponent {
  title = 'Dashboard';
}
