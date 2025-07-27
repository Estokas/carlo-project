import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService, Product } from '../../services/product';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddProductDialogComponent } from '../add-product-dialog.component';
import { collection, addDoc, Firestore } from '@angular/fire/firestore';
import { setDoc as firestoreSetDoc, DocumentReference } from '@angular/fire/firestore';
import { doc as firestoreDoc } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, RouterModule],
  templateUrl: './catalog.html'
})
export class CatalogComponent implements OnInit {
  products: Product[] = [];
  firestoreService: any;
  hovering = false;

  constructor(private productService: ProductService, private dialog: MatDialog, private fireStore: Firestore, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  openAddDialog(product?: Product) {
  const dialogRef = this.dialog.open(AddProductDialogComponent, {
    width: '600px',
    data: product ? { ...product } : null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (result.id) {
        this.productService.updateProduct(result.id, result).then(() => this.loadProducts());
      } else {
        this.productService.addProduct(result).then(() => this.loadProducts());
      }
    }
  });
}

addToCart(item: Product): Promise<void> {
  const cartRef = collection(this.fireStore, 'cart');

  return this.productService.getCartItems().then(cartItems => {
    // Match by productName or SKU to avoid issues with missing IDs
    const existing = cartItems.find(i => i.productName === item.productName);

    if (existing && existing.id) {
      const existingDocRef = firestoreDoc(this.fireStore, `cart/${existing.id}`);
      return firestoreSetDoc(existingDocRef, {
        ...item,
        quantity: (existing.quantity || 1) + 1
      }).then(() => {
        this.snackBar.open('Quantity updated in cart.', 'Close', { duration: 3000 });
      });
    } else {
      const cartItem = { ...item, quantity: 1 };
      return addDoc(cartRef, cartItem).then(() => {
        this.snackBar.open('Item added to cart.', 'Close', { duration: 3000 });
      });
    }
  }).catch(err => {
    console.error('Error adding to cart:', err);
    this.snackBar.open('Failed to add item.', 'Close', { duration: 3000 });
    return Promise.reject(err);
  });
}

editProduct(product: Product) {
    // Clone the product to avoid mutating the original in the list
    const productCopy = { ...product };
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '500px',
      data: productCopy,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(result.id, result).then(() => {
          this.loadProducts();
        });
      } else {
        this.loadProducts();
      }
    });
  }

  deleteProduct(id?: string) {
    if (id && confirm('Are you sure you want to delete this item?')) {
      this.productService.deleteProduct(id).then(() => {
        this.loadProducts();
      });
    }
  }
}


function setDoc(
  cartItemRef: DocumentReference,
  data: { quantity: number; id?: string; productName: string; description: string; price: number; type: "product" | "service"; }
): Promise<void> {
  return firestoreSetDoc(cartItemRef, data);
}

function doc(fireStore: Firestore, path: string): DocumentReference {
  return firestoreDoc(fireStore, path);
}


