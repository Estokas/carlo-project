import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './add-product-dialog.component.html'
})
export class AddProductDialogComponent {
  form: FormGroup;

constructor(
  public dialogRef: MatDialogRef<AddProductDialogComponent>,
  private fb: FormBuilder,
  @Inject(MAT_DIALOG_DATA) public data: any
) {
  this.form = this.fb.group({
    id: [data?.id || null],
    productName: [data?.productName || '', Validators.required],
    description: [data?.description || '', Validators.required],
    price: [data?.price || 0, [Validators.required, Validators.min(0)]],
    type: [data?.type || 'product', Validators.required],
  });
}

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}