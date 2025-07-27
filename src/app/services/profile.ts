import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  doc,
  updateDoc,
  getDoc,
  docData,
} from '@angular/fire/firestore';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private firestore = inject(Firestore);

  updateProfile(userId: string, data: any) {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, data));
  }

  getProfile(userId: string) {
    const userRef = doc(this.firestore, `users/${userId}`);
    return docData(userRef); // returns an Observable<any>
  }
}
