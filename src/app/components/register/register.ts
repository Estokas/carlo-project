import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router, private http: HttpClient) {
    this.form = this.fb.group({
      name: '',
      email: '',
      password: ''
    });
  }

  register() {
  const email = this.form.value.email;
  const password = this.form.value.password;

  if (!email || !password) {
    alert('Email and password are required');
    return;
  }

  this.http.post<FirebaseSignUpResponse>(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebase.apiKey}`,
    {
      email,
      password,
      returnSecureToken: true
    }
  ).subscribe({
    next: (res: FirebaseSignUpResponse) => {
      console.log('Registration successful:', res);
      // 👇 Save the user to localStorage so auth guard works
      localStorage.setItem('user', JSON.stringify(res));
      this.router.navigate(['/login']);
    },
    error: (err: FirebaseError) => {
      console.error('Firebase error:', err);
      alert(err.error?.error?.message || 'Registration failed');
    }
  });
}
}