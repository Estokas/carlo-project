import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const user = localStorage.getItem('user');

  console.log('Checking authGuard: user=', user);
  return user ? true : router.createUrlTree(['/login']);
};