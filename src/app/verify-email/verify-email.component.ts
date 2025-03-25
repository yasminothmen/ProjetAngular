import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent {
  constructor(private authService : AuthService, private router : Router) { }

  logout() {
    this.authService.logout().then(() => {
      
      this.router.navigate(['login']).then();
    });
  }
  sendVerifyEmail() {
    this.authService.sendVerifyEmail().then(() => {
      alert('email sent')
    });
  }
}