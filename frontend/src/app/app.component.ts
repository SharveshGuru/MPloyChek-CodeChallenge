import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [RouterModule, CommonModule]
})
export class AppComponent {
  title = 'Angular + NodeJS SPA';
  isLoggedIn = false;
  isAdmin = false;

  constructor(private router: Router) {
    this.checkAuthState();
    router.events.subscribe(() => this.checkAuthState());
  }

  private checkAuthState() {
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
    
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.isAdmin = payload.role === 'Admin';
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
    this.isLoggedIn = false;
    this.isAdmin = false;
  }
}