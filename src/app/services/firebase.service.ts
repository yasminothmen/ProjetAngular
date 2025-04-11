import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseAuthService {
  private firebaseApp;

  constructor(private afAuth: AngularFireAuth) {
    // Initialisation explicite de Firebase
    this.firebaseApp = initializeApp(environment.firebaseConfig);
  }

  async createFirebaseAccount(email: string, password: string): Promise<string> {
    try {
      console.log('Tentative de création de compte pour:', email);
      
      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      
      if (!userCredential.user) {
        throw new Error('No user returned from Firebase');
      }
      
      console.log('Compte créé avec UID:', userCredential.user.uid);
      return userCredential.user.uid;
      
    } catch (error) {
      console.error('Erreur Firebase détaillée:', error);
      throw this.translateFirebaseError(error);
    }
  }

  private translateFirebaseError(error: any): Error {
    const errorMap: {[key: string]: string} = {
      'auth/email-already-in-use': 'Cet email est déjà utilisé',
      'auth/invalid-email': 'Email invalide',
      'auth/operation-not-allowed': 'Opération non autorisée',
      'auth/weak-password': 'Mot de passe trop faible (min 6 caractères)',
      'auth/network-request-failed': 'Erreur de connexion à Firebase'
    };

    return new Error(errorMap[error.code] || error.message || 'Erreur Firebase inconnue');
  }
}