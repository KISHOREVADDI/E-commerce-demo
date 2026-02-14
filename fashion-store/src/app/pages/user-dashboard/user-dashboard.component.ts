import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  user: any;
  orders: any[] = [];
  adminUser: boolean = false;

  constructor(private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.loadOrders();

      // Check if admin
      if (this.user.role === 'ADMIN') {
        this.adminUser = true;
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadOrders() {
    this.http.get<any[]>(`http://localhost:8080/api/orders/${this.user.id}`)
      .subscribe({
        next: (data) => this.orders = data,
        error: (err) => console.error('Failed to fetch orders', err)
      });
  }
}
