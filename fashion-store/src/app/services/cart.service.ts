import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CartService {
    private apiUrl = 'http://localhost:8080/api/cart';
    private cartSubject = new BehaviorSubject<any>(null);
    cart$ = this.cartSubject.asObservable();

    constructor(private http: HttpClient) {
        this.loadCart();
    }

    private loadCart() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
            this.http.get(`${this.apiUrl}/${user.id}`).subscribe({
                next: (cart: any) => {
                    this.cartSubject.next(cart);
                },
                error: (error) => {
                    console.error('Error loading cart', error);
                    this.cartSubject.next(null); // Ensure cart is cleared on error
                }
            });
        } else {
            this.cartSubject.next(null);
        }
    }

    clearCart() {
        this.cartSubject.next(null);
    }

    addToCart(productId: number) {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (!user) {
            alert('Please login to add items to cart');
            return;
        }

        this.http.post(`${this.apiUrl}/${user.id}/add`, { productId }).subscribe({
            next: () => {
                this.loadCart();
                alert('Product added to cart!');
            },
            error: (err) => {
                console.error('Error adding to cart', err);
                alert('Failed to add product to cart');
            }
        });
    }

    removeFromCart(productId: number) {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
            this.http.post(`${this.apiUrl}/${user.id}/remove`, { productId }).subscribe({
                next: (cart) => {
                    this.cartSubject.next(cart);
                },
                error: (err) => console.error('Error removing from cart', err)
            });
        }
    }

    getCart(): Observable<any> {
        return this.cart$;
    }
}
