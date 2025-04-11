import { User } from './user';

export class Teacher extends User {
  matieresEnseignees: string[]; // Liste des matières enseignées

  constructor(
    firstname: string,
    lastname: string,
    username: string,
    password: string,
    //confirmPassword: string,
    email: string,
    matieresEnseignees: string[] = [] // Liste des matières enseignées
  ) {
    super(); // Appel du constructeur de la classe User
    this.firstname = firstname;
    this.lastname = lastname;
    this.username = username;
    this.password = password;
    //this.confirmPassword = confirmPassword;
    this.email = email;
    this.role = 'teacher'; // Définir le rôle comme "teacher"
    this.matieresEnseignees = matieresEnseignees; // Initialiser les matières enseignées
  }
}
