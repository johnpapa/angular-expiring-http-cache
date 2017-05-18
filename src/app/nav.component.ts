import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  template: `
<md-toolbar color="primary" class="dark">
  <div class="md-toolbar-tools" fxLayout="row nowrap" fxFlex fxLayoutAlign="end center">
    <a class="ng-title-icon" href="http://angular.io" target="_blank"><i></i></a>
    <span fxFlex class="title">Data Caching</span>
    <span fxFlex="grow"></span>
    <a fxFlex md-button [routerLink]="['/dashboard']"
      routerLinkActive="router-link-active"><span>Dashboard</span></a>
    <a fxFlex md-button [routerLink]="['/heroes']"
      routerLinkActive="router-link-active"><span>Heroes</span></a>
    <a fxFlex md-button [routerLink]="['/villains']"
      routerLinkActive="router-link-active"><span>Villains</span></a>
    <a fxFlex md-button href="http://johnpapa.net" target="_blank"><span>John Papa / Ward Bell</span></a>
  </div>
</md-toolbar>
  `
})
export class NavComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
