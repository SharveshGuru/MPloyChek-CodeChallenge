import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule]
})
export class RegisterComponent {
  user = { username: '', email: '', password: '', role: 'General User' };
  passwordFieldType: string = 'password';  
  constructor(private authService: AuthService, private router: Router) {}

  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  register() {
    const token = localStorage.getItem('token');
    if (!token) {
      // console.error('No token found, admin authentication required!');
      return;
    }
  
    if (!this.user.username || !this.user.email || !this.user.password) {
      console.error('Missing required fields:', this.user);
      return;
    }
  
    const userData = {
      username: this.user.username.trim(),
      email: this.user.email.trim(),
      password: this.user.password.trim(),
      role: this.user.role || 'General User',
    };
  
    console.log("📤 Sending Registration Data:", userData);
  
    this.authService.register(userData, token).subscribe(
      (res) => {
        // console.log('User registered successfully:', res);
        // Optional: Reset form or navigate
        this.user = { username: '', email: '', password: '', role: 'General User' };
        alert('Registration successful!');

      },
      (error) => {
        // console.error('Registration failed:', error);
        // Optionally show error message to user
        alert(error.error?.message || 'Registration failed');
      }
    );
  }
}