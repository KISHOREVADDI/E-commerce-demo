import { Component, Input, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service'; // Import ProductService
import { AuthService } from '../../services/auth.service'; // Import AuthService

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {
  @Input() product: any;
  currentUser: any = null;

  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }

  addToCart(event: Event) {
    event.stopPropagation(); // Prevent navigation to product detail
    if (this.product && this.product.id) {
      this.cartService.addToCart(this.product.id);
    }
  }

  toggleWishlist(event: Event) {
    event.stopPropagation();
    if (!this.currentUser) {
      alert('Please login to add to wishlist');
      return;
    }
    if (this.product && this.product.id) {
      this.productService.addToWishlist(this.currentUser.id, this.product.id).subscribe({
        next: (res) => {
          alert('Added to wishlist!');
          // Ideally, we should update the UI state to reflect this (e.g., filled heart)
        },
        error: (err) => {
          console.error('Error adding to wishlist', err);
          alert('Could not add to wishlist. Try again.');
        }
      });
    }
  }
}
