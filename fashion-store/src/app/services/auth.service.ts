import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/api/users';
    private userSubject = new BehaviorSubject<any>(this.getUserFromStorage());
    user$ = this.userSubject.asObservable();

    constructor(private http: HttpClient) { }

    private getUserFromStorage() {
        const userData = localStorage.getItem('user');
        return userData ? JSON.parse(userData) : null;
    }

    login(user: any) {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
    }

    logout() {
        localStorage.removeItem('user');
        this.userSubject.next(null);
        // Clear cart on logout. Since CartService depends on AuthService often, we might create a circular dependency.
        // Better to handle this in the component or have CartService subscribe to AuthService.
        // For now, let's keep it simple and assume the user will reload or the app handles it.
        // Actually, let's reload the page to be safe and clear all states.
        // window.location.reload(); 
    }

    // Method to refresh state if modified externally
    refreshUser() {
        this.userSubject.next(this.getUserFromStorage());
    }

    updateUser(id: number, user: any) {
        return this.http.put(`${this.apiUrl}/${id}`, user).pipe(
            tap((updatedUser: any) => {
                this.login(updatedUser); // Update local storage and subject
            })
        );
    }
}
