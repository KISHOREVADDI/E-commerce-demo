import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  allProducts: any[] = []; // Store all products for filtering

  // Filter states
  selectedCategories: any = { Men: false, Women: false, Kids: false };
  priceRange: number = 5000;
  selectedColor: string = '';

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.allProducts = data;
      this.applyFilters(); // Apply initial filters
    });
  }

  toggleCategory(category: string) {
    this.selectedCategories[category] = !this.selectedCategories[category];
    this.applyFilters();
  }

  setPriceRange(event: any) {
    this.priceRange = event.target.value;
    this.applyFilters();
  }

  setColor(color: string) {
    // Toggle color if clicking the same one, otherwise set new color
    this.selectedColor = this.selectedColor === color ? '' : color;
    this.applyFilters();
  }

  applyFilters() {
    this.products = this.allProducts.filter(product => {
      // Category Filter
      const categoryMatch =
        (!this.selectedCategories.Men && !this.selectedCategories.Women && !this.selectedCategories.Kids) || // No category selected (show all)
        (this.selectedCategories.Men && product.category === 'Men') ||
        (this.selectedCategories.Women && product.category === 'Women') ||
        (this.selectedCategories.Kids && product.category === 'Kids');

      // Price Filter
      const priceMatch = product.price <= this.priceRange;

      // Color Filter
      const colorMatch = !this.selectedColor || (product.color && product.color.toLowerCase() === this.selectedColor.toLowerCase());

      return categoryMatch && priceMatch && colorMatch;
    });
  }
}
