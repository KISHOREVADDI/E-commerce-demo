import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {
  products: any[] = [];
  newProduct: any = {
    name: '', brand: '', price: null, originalPrice: null, discount: null,
    image: '', category: 'Men', description: ''
  };

  selectedFiles: File[] = [];
  imagePreviews: string[] = [];
  uploadError: string = '';

  constructor(private http: HttpClient) {
    this.loadProducts();
  }

  loadProducts() {
    this.http.get<any[]>('http://localhost:8080/api/products')
      .subscribe(data => this.products = data);
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (files.length > 5) {
      this.uploadError = 'You can only upload a maximum of 5 images.';
      return;
    }
    this.uploadError = '';
    this.selectedFiles = Array.from(files);

    // Generate previews
    this.imagePreviews = [];
    for (let file of this.selectedFiles) {
      const reader = new FileReader();
      reader.onload = (e: any) => this.imagePreviews.push(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  addProduct() {
    if (this.selectedFiles.length === 0) {
      alert('Please select at least one image.');
      return;
    }

    const formData = new FormData();
    for (let file of this.selectedFiles) {
      formData.append('files', file);
    }

    this.http.post<string[]>('http://localhost:8080/api/upload', formData).subscribe({
      next: (urls) => {
        if (urls.length > 0) {
          this.newProduct.image = urls[0]; // Main image
          this.newProduct.images = urls;   // All images
        }

        // Save Product
        this.http.post('http://localhost:8080/api/products', this.newProduct)
          .subscribe(() => {
            alert('Product added successfully!');
            this.loadProducts();
            this.resetForm();
          });
      },
      error: (err) => {
        console.error('Upload failed', err);
        alert('Failed to upload images.');
      }
    });
  }

  resetForm() {
    this.newProduct = {
      name: '', brand: '', price: null, originalPrice: null, discount: null,
      image: '', images: [], category: 'Men', description: ''
    };
    this.selectedFiles = [];
    this.imagePreviews = [];
    this.uploadError = '';
  }
}
