export class User {
  id: string; // MongoDB utilise un ObjectId sous forme de String
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  username: string;

  constructor() {
    this.id = '';
    this.firstname = '';
    this.lastname = '';
    this.email = '';
    this.password = '';
    this.confirmPassword = '';
    this.username = '';
  }
}
