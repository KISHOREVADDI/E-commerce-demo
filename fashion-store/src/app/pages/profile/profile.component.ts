import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any;
  isEditing = false;
  updatedUser: any = {};

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.updatedUser = { ...user };
      } else {
        this.router.navigate(['/login']);
      }
    });
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.updatedUser = { ...this.user }; // Reset changes if cancelled
    }
  }

  saveProfile() {
    if (!this.user) return;

    this.authService.updateUser(this.user.id, this.updatedUser).subscribe({
      next: (response) => {
        alert('Profile updated successfully!');
        this.isEditing = false;
      },
      error: (err) => {
        console.error('Failed to update profile', err);
        alert('Failed to update profile');
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
