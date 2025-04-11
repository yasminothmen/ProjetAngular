import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const auth: AngularFireAuth = inject(AngularFireAuth);
  const router: Router = inject(Router);

  return auth.authState.pipe(map(user => {
    if (user && user.emailVerified) {
      return true;
    }
    
    if (user) {
      router.navigate(['/verify-email']); 
    } else {
      router.navigate(['/login']);
    }
    return false;
  }));
};

export const notAuthenticatedGuard: CanActivateFn = (route, state) => {
  const auth: AngularFireAuth = inject(AngularFireAuth);
  const router: Router = inject(Router);
  
  return auth.authState.pipe(map(user => {
    if (!user) return true;
    
    if (user.emailVerified) {
      router.navigate(['/acceuil/dashboard']);
    } else {
      router.navigate(['/verify-email']); // Changé à la route racine
    }
    return false;
  }));
};

export const verifyEmailGuard: CanActivateFn = (route, state) => {
  const auth: AngularFireAuth = inject(AngularFireAuth);
  const router: Router = inject(Router);
  
  return auth.authState.pipe(map(user => {
    if (user && !user.emailVerified) return true;
    
    if (user) {
      router.navigate(['/acceuil/dashboard']);
    } else {
      router.navigate(['/login']);
    }
    return false;
  }));
};