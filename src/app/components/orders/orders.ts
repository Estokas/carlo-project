import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order';
import { MatCardModule } from '@angular/material/card';
import { MainToolbarComponent } from '../main-toolbar/main-toolbar';

@Component({
  selector: 'app-orders',
  standalone: true,
  templateUrl: './orders.html',
  imports: [CommonModule, MatCardModule, MainToolbarComponent]
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe(data => this.orders = data);
  }

  getOrderTotal(items: any[]): number {
  return items.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
}
}