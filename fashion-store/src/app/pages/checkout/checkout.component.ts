import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  paymentMethod: string = 'razorpay'; // Default to Razorpay
  upiId: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  placeOrder() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      alert('Please login to checkout');
      this.router.navigate(['/login']);
      return;
    }

    const shippingAddress = "123 Main St, New York, NY 10001, USA"; // Placeholder

    if (this.paymentMethod === 'razorpay' || this.paymentMethod === 'upi') {
      this.initiateRazorpayPayment(user, shippingAddress);
    } else if (this.paymentMethod === 'cod') {
      this.placeCODOrder(user, shippingAddress);
    }
  }

  initiateRazorpayPayment(user: any, shippingAddress: string) {
    // Create Razorpay order
    this.http.post<any>('http://localhost:8080/api/payment/create-order', {
      amount: 37498, // Amount in paise (₹374.98)
      currency: 'INR'
    }).subscribe({
      next: (order) => {
        const options = {
          key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay test key
          amount: order.amount,
          currency: order.currency,
          name: 'Fashnix Fashion',
          description: 'Order Payment',
          order_id: order.razorpayOrderId,
          handler: (response: any) => {
            this.verifyPayment(response, user, shippingAddress);
          },
          prefill: {
            name: user.name,
            email: user.email || 'customer@fashnix.com',
            contact: user.phone || '9999999999'
          },
          theme: {
            color: '#000000'
          },
          modal: {
            ondismiss: () => {
              alert('Payment cancelled');
            }
          }
        };

        const rzp = new Razorpay(options);
        rzp.open();
      },
      error: (err) => {
        console.error('Failed to create order', err);
        alert('Failed to initiate payment. Please try again.');
      }
    });
  }

  verifyPayment(response: any, user: any, shippingAddress: string) {
    this.http.post('http://localhost:8080/api/payment/verify', {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
      userId: user.id,
      shippingAddress: shippingAddress
    }).subscribe({
      next: () => {
        alert('Payment successful! Your order has been placed.');
        this.router.navigate(['/user']);
      },
      error: (err) => {
        console.error('Payment verification failed', err);
        alert('Payment verification failed. Please contact support.');
      }
    });
  }

  placeCODOrder(user: any, shippingAddress: string) {
    const orderRequest = {
      shippingAddress: shippingAddress,
      paymentMethod: 'cod'
    };

    this.http.post(`http://localhost:8080/api/orders/${user.id}/place`, orderRequest).subscribe({
      next: () => {
        alert('Order placed successfully! You will pay on delivery.');
        this.router.navigate(['/user']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to place order. Please try again.');
      }
    });
  }
}
