import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  productName: string;
  description: string;
  price: number;
  type: 'product' | 'service';
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private firestore: Firestore) {}

  getProducts(): Observable<Product[]> {
    const ref = collection(this.firestore, 'product'); // ✅ Using 'product' collection
    return collectionData(ref, { idField: 'id' }) as Observable<Product[]>;
  }

  getCartItems(): Promise<any[]> {
  const cartRef = collection(this.firestore, 'cart');
  return firstValueFrom(collectionData(cartRef, { idField: 'id' }))
    .then(data => data || []);
}

  addProduct(product: Product) {
    const ref = collection(this.firestore, 'product');
    return addDoc(ref, product);
  }

  updateProduct(id: string, product: Product) {
    if (!id) {
      console.error('Update failed: missing product ID');
      return Promise.reject('Missing ID');
    }

    const productRef = doc(this.firestore, 'product', id); // ✅ Match collection name here
    return updateDoc(productRef, {
      productName: product.productName,
      description: product.description,
      price: product.price,
      type: product.type
    });
  }

  deleteProduct(id: string) {
    const ref = doc(this.firestore, 'product', id); // ✅ Match collection name
    return deleteDoc(ref);
  }

  addToCart(item: any) {
  const cartRef = collection(this.firestore, 'collection');
  return addDoc(cartRef, {
    productId: item.id,
    productName: item.productName,
    price: item.price,
    quantity: 1,
    type: item.type
  });
}

removeFromCart(id: string): Promise<void> {
    // Remove item from localStorage cart by id
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.filter((item: any) => item.id !== id);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    return Promise.resolve();
  }
}
