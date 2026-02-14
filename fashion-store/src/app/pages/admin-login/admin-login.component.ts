import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-admin-login',
    templateUrl: './admin-login.component.html',
    styleUrls: ['./admin-login.component.scss']
})
export class AdminLoginComponent {
    loginData = { email: '', password: '' };
    errorMsg = '';

    constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

    onLogin() {
        this.http.post('http://localhost:8080/api/auth/login', this.loginData).subscribe({
            next: (response: any) => {
                if (response.role !== 'ADMIN') {
                    this.errorMsg = 'Access Denied: Admins only.';
                    return;
                }

                console.log('Admin Login successful', response);
                this.authService.login(response);
                this.router.navigate(['/admin']);
            },
            error: (error) => {
                console.error('Login failed', error);
                this.errorMsg = 'Invalid Admin credentials';
            }
        });
    }
}
