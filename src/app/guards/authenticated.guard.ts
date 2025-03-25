import { inject } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
export const authenticatedGuard: CanActivateFn = (route, state) => {
  
const auth: AngularFireAuth = inject(AngularFireAuth);
const router : Router = inject(Router);

  return auth.authState.pipe(map(data => {
    const result = data && data.emailVerified;
    console.log('notAuthenticatedGuard', data)
    if (!result) {
      console.log('authenticatedGuard failed')
      if (data && data.emailVerified) {
        router.navigate(['acceuil/verify-email']);
      } else {
        router.navigate(['acceuil/login']);
      }
    }
    return !!result;
  }))

};

export const notAuthenticatedGuard: CanActivateFn = (route, state) => {
  const auth: AngularFireAuth = inject(AngularFireAuth);
  const router : Router = inject(Router);
  
    return auth.authState.pipe(map(data => {
      const result = !data;
      console.log('notAuthenticatedGuard', data)
      if (!result) {
        console.log('authenticatedGuard failed')
        if (data.emailVerified) {
          router.navigate(['acceuil/dashboard']);
        } else {
          router.navigate(['acceuil/verify-email']);
        }
      }
      return result;
    }))
};

export const verifyEmailGuard: CanActivateFn = (route, state) => {
  const auth: AngularFireAuth = inject(AngularFireAuth);
  const router : Router = inject(Router);
  
    return auth.authState.pipe(map(data => {
      const result = !data;
      if (data && !data.emailVerified) {
        return true;
      }
      if (data) {
        router.navigate(['acceuil/dashboard']);
      } else {
        router.navigate(['acceuil/login']);
      }
      return false;
    }))
};