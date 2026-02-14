import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: any;
  similarProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService
  ) { }

  selectedImage: string = '';
  allImages: string[] = [];
  currentImageIndex: number = 0;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.productService.getProductById(id).subscribe(data => {
        this.product = data;
        this.selectedImage = this.product.image;

        // Build array of all images
        this.allImages = [this.product.image];
        if (this.product.images && this.product.images.length > 0) {
          this.allImages = [this.product.image, ...this.product.images];
        }
        this.currentImageIndex = 0;
      });
    });
  }

  changeImage(img: string) {
    this.selectedImage = img;
    this.currentImageIndex = this.allImages.indexOf(img);
  }

  previousImage() {
    if (this.allImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.allImages.length) % this.allImages.length;
      this.selectedImage = this.allImages[this.currentImageIndex];
    }
  }

  nextImage() {
    if (this.allImages.length > 0) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.allImages.length;
      this.selectedImage = this.allImages[this.currentImageIndex];
    }
  }

  addToCart() {
    if (this.product) {
      if (!this.selectedSize && this.product.sizes && this.product.sizes.length > 0) {
        alert('Please select a size');
        return;
      }
      this.cartService.addToCart(this.product.id);
    }
  }

  selectedSize: string = '';

  selectSize(size: string) {
    this.selectedSize = size;
  }

  addToWishlist() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      alert('Please login to add to wishlist');
      return;
    }
    this.productService.addToWishlist(user.id, this.product.id).subscribe({
      next: () => alert('Added to wishlist'),
      error: () => alert('Failed to add to wishlist')
    });
  }
}
