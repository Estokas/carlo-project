import { Component, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-main-toolbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterModule],
  templateUrl: './main-toolbar.html',
  styleUrls: ['./main-toolbar.css']
})
export class MainToolbarComponent implements OnDestroy {
  constructor(private cdr: ChangeDetectorRef) {
    window.addEventListener('storage', this.onStorageChange);
  }

  isLoggedIn() {
    return !!localStorage.getItem('user');
  }

  logout() {
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  onStorageChange = () => {
    this.cdr.detectChanges();
  };

  ngOnDestroy() {
    window.removeEventListener('storage', this.onStorageChange);
  }
}
