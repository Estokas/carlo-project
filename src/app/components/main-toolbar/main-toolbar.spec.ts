import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainToolbarComponent } from './main-toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

describe('MainToolbarComponent', () => {
  let component: MainToolbarComponent;
  let fixture: ComponentFixture<MainToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainToolbarComponent, RouterTestingModule, MatToolbarModule, MatButtonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(MainToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show toolbar only when logged in', () => {
    localStorage.setItem('user', JSON.stringify({ username: 'test' }));
    expect(component.isLoggedIn()).toBeTrue();
    localStorage.removeItem('user');
    expect(component.isLoggedIn()).toBeFalse();
  });
});
