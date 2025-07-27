import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private firestore: Firestore) {}

  getOrders(): Observable<any[]> {
    const ordersRef = collection(this.firestore, 'orders');
    return collectionData(ordersRef, { idField: 'id' }) as Observable<any[]>;
  }
  placeOrder(order: any): Promise<any> {
  const ordersRef = collection(this.firestore, 'orders');
  return addDoc(ordersRef, order);
}
}