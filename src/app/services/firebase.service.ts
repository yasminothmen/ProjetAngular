import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  constructor(private afAuth: AngularFireAuth) {}

  // Méthode pour créer un compte Firebase (sans login automatique)
  async createFirebaseAccount(email: string, password: string): Promise<string> {
    try {
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return userCredential.user?.uid || ''; // Retourne l'UID Firebase
    } catch (error) {
      console.error('Erreur Firebase:', error);
      throw error;
    }
  }
}