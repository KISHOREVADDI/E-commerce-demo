import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';

import { ProductListComponent } from './pages/product-list/product-list.component';

import { ProductDetailComponent } from './pages/product-detail/product-detail.component';

import { CartComponent } from './pages/cart/cart.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { AdminLoginComponent } from './pages/admin-login/admin-login.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { UserDashboardComponent } from './pages/user-dashboard/user-dashboard.component';
import { WishlistComponent } from './pages/wishlist/wishlist.component';
import { OrderDetailComponent } from './pages/order-detail/order-detail.component';
import { SavedAddressesComponent } from './pages/saved-addresses/saved-addresses.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'user', component: UserDashboardComponent },
  { path: 'wishlist', component: WishlistComponent },
  { path: 'orders/:id', component: OrderDetailComponent }, // New route
  { path: 'login', component: LoginComponent },
  { path: 'admin-login', component: AdminLoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'addresses', component: SavedAddressesComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
