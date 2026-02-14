import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-wishlist',
    templateUrl: './wishlist.component.html',
    styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {

    wishlistItems: any[] = [];
    isLoading: boolean = true;

    constructor(
        private productService: ProductService,
        private cartService: CartService
    ) { }

    ngOnInit(): void {
        this.loadWishlist();
    }

    loadWishlist() {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
            this.productService.getWishlist(user.id).subscribe({
                next: (items) => {
                    this.wishlistItems = items;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error('Error loading wishlist', err);
                    this.isLoading = false;
                }
            });
        } else {
            this.isLoading = false;
        }
    }

    removeFromWishlist(productId: number) {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
            this.productService.removeFromWishlist(user.id, productId).subscribe({
                next: () => {
                    this.loadWishlist(); // Refresh list
                },
                error: (err) => alert('Failed to remove from wishlist')
            });
        }
    }

    addToCart(product: any) {
        this.cartService.addToCart(product.id);
    }
}
