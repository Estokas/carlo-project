import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { ProfileService } from '../../services/profile';
import { MainToolbarComponent } from '../main-toolbar/main-toolbar';

import { Firestore } from '@angular/fire/firestore'; // ✅ Correct import

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MainToolbarComponent
  ]
})
export class ProfileComponent implements OnInit {
  form: FormGroup;
  firestore = inject(Firestore); // ✅ will now be injected correctly

  constructor(private fb: FormBuilder, private profileService: ProfileService) {
    this.form = this.fb.group({ name: '', email: '', password: '' });
  }

  ngOnInit() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.form.patchValue(user);
  }

  updateProfile() {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.profileService.updateProfile(user.id, this.form.value).subscribe(() => {
      const updated = { ...user, ...this.form.value };
      localStorage.setItem('user', JSON.stringify(updated));
      alert('Profile updated');
    });
  }
}
