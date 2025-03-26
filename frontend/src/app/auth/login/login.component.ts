import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              [(ngModel)]="email" 
              name="email" 
              required
              placeholder="Enter your email"
            >
          </div>
          <div class="form-group">
            <label>Password</label>
            <input 
              [type]="passwordFieldType" 
              [(ngModel)]="password" 
              name="password" 
              required
              placeholder="Enter your password"
            >
            <button type="button" class="show-password-btn" (click)="togglePasswordVisibility()">
              {{ passwordFieldType === 'password' ? 'Show Password' : 'Hide Password' }}
            </button>
          </div>
          <button type="submit">Login</button>
          <p *ngIf="errorMessage" class="error">{{ errorMessage }}</p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    body {
      background-color: #f9fafb;
      color: #1a1a1a;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 85vh;
      background-color: #f9fafb;
    }

    .login-box {
      background: white;
      padding: 2.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      width: 350px;
      border: 1px solid rgba(0, 0, 0, 0.03);
      animation: fadeIn 0.4s ease-out forwards;
    }

    .login-box h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: #1a1a1a;
      font-size: 1.75rem;
      font-weight: 700;
    }

    .form-group {
      margin-bottom: 1.75rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.75rem;
      font-weight: 500;
      color: #1a1a1a;
      font-size: 0.95rem;
    }

    .form-group input {
      width: 100%;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      background-color: #f9fafb;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .form-group input:focus {
      outline: none;
      border-color: #4895ef;
      background-color: white;
      box-shadow: 0 0 0 3px rgba(72, 149, 239, 0.15);
    }

    button {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #4361ee, #3f37c9);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      margin-top: 0.5rem;
    }

    button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(67, 97, 238, 0.2);
    }

    button:active {
      transform: translateY(0);
    }

    .error {
      color: #ef4444;
      text-align: center;
      margin-top: 0.5rem;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.25rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .login-box {
        padding: 1.5rem;
      }
    }

    /* Add styling for the show password button */
    .show-password-btn {
      background: none;
      border: none;
      color: #4895ef;
      font-size: 0.85rem;
      cursor: pointer;
      margin-left: 0.5rem;
      padding: 0;
      transition: color 0.3s ease;
    }

    .show-password-btn:hover {
      color: #3578e5;
    }

    .show-password-btn:focus {
      outline: none;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  passwordFieldType: string = 'password'; // Default to password field type

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // Toggle the password visibility
  togglePasswordVisibility() {
    this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onSubmit() {
    this.authService.login({ email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Login failed. Please try again.';
          console.error('Login error:', error);
        }
      });
  }
}
