import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog } from '@angular/material/dialog';
import { CheckoutDialogComponent } from '../checkout-dialog/checkout-dialog';
import { MatDialogModule } from '@angular/material/dialog';

import { Observable } from 'rxjs';
import {
  Firestore,
  collection,
  doc,
  deleteDoc,
  addDoc
} from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';

import { MainToolbarComponent } from '../main-toolbar/main-toolbar';
import { ProductService } from '../../services/product';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatToolbarModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MainToolbarComponent,
    MatFormFieldModule,
    MatDialogModule,
    // CheckoutDialogComponent
  ],
  templateUrl: './cart.html',
  styleUrls: ['./cart.css']
})
export class CartComponent implements OnInit {
  cart$: Observable<any[]> | undefined;
  cartItems: any[] = [];
  displayedColumns: string[] = ['select', 'productName', 'price', 'quantity', 'type', 'actions'];
  canCheckout = false;
  paymentMethod: string = '';

  constructor(
    private firestore: Firestore,
    private productService: ProductService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const cartRef = collection(this.firestore, 'cart');
    this.cart$ = collectionData(cartRef, { idField: 'id' }) as Observable<any[]>;

    this.cart$.subscribe(items => {
      this.cartItems = items.map(item => ({ ...item, selected: false }));
      this.onSelectionChange();
    });
  }

  removeFromCart(id: string) {
    const docRef = doc(this.firestore, `cart/${id}`);
    deleteDoc(docRef)
      .then(() => {
        this.snackBar.open('Item removed from cart.', 'Close', { duration: 3000 });
      })
      .catch(() => {
        this.snackBar.open('Failed to remove item.', 'Close', { duration: 3000 });
      });
  }

  get selectedItems() {
  return this.cartItems.filter(i => i.selected);
}

  onSelectionChange() {
  this.canCheckout = this.cartItems.some(item => item.selected);
}

  isAllSelected(items: any[]): boolean {
    return items.length > 0 && items.every(item => item.selected);
  }

  toggleSelectAll(event: any, items: any[]): void {
    const checked = event.checked;
    items.forEach(item => (item.selected = checked));
    this.onSelectionChange();
  }
proceedToCheckout(): void {
  const selectedItems = this.cartItems.filter(item => item.selected);

  if (selectedItems.length === 0) {
    this.snackBar.open('No items selected for checkout.', 'Close', { duration: 3000 });
    return;
  }

  const dialogRef = this.dialog.open(CheckoutDialogComponent, {
    width: '500px',
    data: { items: selectedItems }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result?.confirmed && result.paymentMethod) {
      const ordersRef = collection(this.firestore, 'orders');
      const totalAmount = selectedItems.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);

      addDoc(ordersRef, {
        items: selectedItems,
        paymentMethod: result.paymentMethod,
        total: totalAmount,
        createdAt: new Date()
      }).then(() => {
        this.snackBar.open('✅ Order placed successfully!', 'Close', { duration: 3000 });
        this.cartItems = this.cartItems.filter(item => !item.selected);
        this.onSelectionChange();
      }).catch(error => {
        console.error('[Cart] Failed to place order:', error);
        this.snackBar.open('❌ Failed to place order.', 'Close', { duration: 3000 });
      });
    }
  });
}
}
