import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
<md-toolbar class="footer">
  <div class="md-toolbar-tools" fxLayout="row nowrap" fxFlex fxLayoutAlign="end center">
    <app-cache-countdown></app-cache-countdown>
  </div>
</md-toolbar>
  `
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
