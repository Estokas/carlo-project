import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainToolbarComponent } from './components/main-toolbar/main-toolbar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <router-outlet />
  `,
  styles: []
})
export class AppComponent {}