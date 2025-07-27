import { Component } from '@angular/core';
import { MainToolbarComponent } from '../main-toolbar/main-toolbar';
import { CatalogComponent } from '../catalog/catalog';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [ MainToolbarComponent, CatalogComponent],
  template: `
    <app-main-toolbar></app-main-toolbar>
    <app-catalog></app-catalog>
  `,
  styleUrls: ['./main-page.css']
})
export class MainPageComponent {}
