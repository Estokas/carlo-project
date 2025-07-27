import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ⬅️ Needed for ngModel
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-checkout-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './checkout-dialog.html',
  styleUrls: ['./checkout-dialog.css']
})
export class CheckoutDialogComponent {
  paymentMethod: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<CheckoutDialogComponent>
  ) {}

  getTotal(): number {
    return this.data.items.reduce(
      (acc: number, item: any) => acc + item.price * (item.quantity || 1), 0
    );
  }

  confirm(): void {
    this.dialogRef.close({ confirmed: true, paymentMethod: this.paymentMethod });
  }
}