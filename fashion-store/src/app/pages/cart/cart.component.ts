import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cart: any;

  constructor(private cartService: CartService) { }

  ngOnInit() {
    this.cartService.cart$.subscribe(data => {
      this.cart = data;
    });
  }

  get total() {
    return this.cart?.products?.reduce((acc: number, p: any) => acc + p.price, 0) || 0;
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }
}
