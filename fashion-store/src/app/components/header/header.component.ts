import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any = null;
  searchQuery: string = '';
  cartItemCount: number = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });

    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart?.products?.length || 0;
    });
  }

  logout() {
    this.authService.logout();
    this.cartService.clearCart();
    this.router.navigate(['/login']);
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // Navigate to products with search query (implement later if needed)
      console.log('Searching for:', this.searchQuery);
    }
  }
}
