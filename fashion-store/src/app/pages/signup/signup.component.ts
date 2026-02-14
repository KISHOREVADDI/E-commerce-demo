import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupData = {
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    role: 'USER' // Default role
  };

  constructor(private http: HttpClient, private router: Router) { }

  onSignup() {
    this.http.post('http://localhost:8080/api/auth/signup', this.signupData).subscribe({
      next: (response: any) => {
        console.log('Signup successful', response);
        // Login immediately after signup (or redirect to login)
        // For better UX, let's auto-login: storage + redirect
        localStorage.setItem('user', JSON.stringify(response));

        if (response.role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/user']); // Or /profile
        }
      },
      error: (error) => {
        console.error('Signup failed', error);
        alert('Signup failed. Email might be already taken.');
      }
    });
  }
}
