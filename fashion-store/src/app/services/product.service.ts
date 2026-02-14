import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ProductService {
    private apiUrl = 'http://localhost:8080/api/products';

    constructor(private http: HttpClient) { }

    getProducts(): Observable<any[]> {
        return this.http.get<any[]>(this.apiUrl);
    }

    getProductById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    getProductsByCategory(category: string): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/category/${category}`);
    }

    // Wishlist API
    private wishlistUrl = 'http://localhost:8080/api/wishlist';

    getWishlist(userId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.wishlistUrl}/${userId}`);
    }

    addToWishlist(userId: number, productId: number): Observable<any> {
        return this.http.post(`${this.wishlistUrl}/${userId}/add`, productId);
    }

    removeFromWishlist(userId: number, productId: number): Observable<any> {
        return this.http.delete(`${this.wishlistUrl}/${userId}/remove/${productId}`, { responseType: 'text' });
    }
}
