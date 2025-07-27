import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order';
import { MainToolbarComponent } from '../main-toolbar/main-toolbar';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.html',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatCardModule, MainToolbarComponent]
})
export class CheckoutComponent {
  form: FormGroup;
  total: number = 0;
  cartItems: any[] = [];

  constructor(private fb: FormBuilder, private orderService: OrderService, private router: Router)
 {
    this.form = this.fb.group({ paymentType: '' });
  }

  ngOnInit() {
    this.cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
    this.total = this.cartItems.reduce((acc, item) => acc + item.price, 0);
  }

  submitOrder() {
  const order = {
    items: this.cartItems,
    total: this.total,
    paymentType: this.form.value.paymentType,
    createdAt: new Date()
  };

  this.orderService.placeOrder(order).then(() => {
    localStorage.removeItem('cart');
    alert('Order placed!');
    this.router.navigate(['/orders']);
  }).catch(error => {
    console.error('Failed to place order:', error);
    alert('Failed to place order. Try again.');
  });
}
}