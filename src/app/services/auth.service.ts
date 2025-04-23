import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private userSubject = new BehaviorSubject<any>(null);

  constructor(private fireauth: AngularFireAuth, private router: Router) {
    // Initialize auth state listener
    this.fireauth.authState.subscribe(user => {
      if (user) {
        user.getIdToken().then(token => {
          this.setToken(token);
          this.userSubject.next(user);
        });
      } else {
        this.clearAuthData();
      }
    });
  }

  // Current token as observable
  get currentToken$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  // Current user as observable
  get currentUser$(): Observable<any> {
    return this.userSubject.asObservable();
  }

  // Set authentication data
  private setToken(token: string): void {
    localStorage.setItem('jwt_token', token);
    this.tokenSubject.next(token);
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  // Clear authentication data
  private clearAuthData(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('firebase_user');
    this.tokenSubject.next(null);
    this.userSubject.next(null);
  }

  // Login with email/password
  async login(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.fireauth.signInWithEmailAndPassword(email, password);
      const token = await userCredential.user?.getIdToken();
      
      if (token) {
        this.setToken(token);
        localStorage.setItem('firebase_user', JSON.stringify(userCredential.user));
        
        if (userCredential.user?.emailVerified) {
          this.router.navigate(['acceuil/dashboard']);
        } else {
          this.router.navigate(['/verify-email']);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Register new user
  async register(email: string, password: string): Promise<void> {
    try {
      const userCredential = await this.fireauth.createUserWithEmailAndPassword(email, password);
      await this.sendEmailVerification(userCredential.user);
      this.router.navigate(['/verify-email']);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Send email verification
  async sendEmailVerification(user: any): Promise<void> {
    try {
      await user.sendEmailVerification();
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Password reset
  async forgotPassword(email: string): Promise<void> {
    try {
      await this.fireauth.sendPasswordResetEmail(email);
      this.router.navigate(['/verify-email']);
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  // Google authentication
  async googleSignIn(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await this.fireauth.signInWithPopup(provider);
      const token = await userCredential.user?.getIdToken();
      
      if (token) {
        this.setToken(token);
        this.router.navigate(['acceuil/dashboard']);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await this.fireauth.signOut();
      this.clearAuthData();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Check authentication state
  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this.fireauth.onAuthStateChanged(user => {
        if (user) {
          user.getIdToken().then(token => {
            this.setToken(token);
            resolve(true);
          });
        } else {
          resolve(false);
        }
      });
    });
  }

  // Refresh token
  async refreshToken(): Promise<string | null> {
    try {
      const user = await this.fireauth.currentUser;
      if (user) {
        const token = await user.getIdToken(true);
        this.setToken(token);
        return token;
      }
      return null;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  }

  sendVerifyEmail(): Promise<void> {
    return this.fireauth.currentUser.then(user => {
      if (user) {
        return this.sendEmailVerification(user);
      } else {
        throw new Error('Aucun utilisateur connecté');
      }
    });
  }
  
}