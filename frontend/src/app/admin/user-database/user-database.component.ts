import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-user-database',
  templateUrl: './user-database.component.html',
  styleUrls: ['./user-database.component.css'],
  imports: [CommonModule],
})

export class UserDatabaseComponent implements OnInit {
  users: User[] = [];
  loggedInUserEmail: string | null = null;  
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.getLoggedInUserEmail();
    this.fetchUsers();
  }

  getLoggedInUserEmail() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        this.loggedInUserEmail = parsedUser.email;
      } catch (e) {
        console.error("Error decoding user data:", e);
      }
    }
  }

  fetchUsers() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("No token found, redirecting to login...");
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<User[]>(`${this.apiUrl}/auth/users`, { headers })
      .subscribe({
        next: (data) => this.users = data,
        error: (err) => {
          console.error("Failed to fetch users:", err);
          if (err.status === 401) {
            localStorage.removeItem('token'); 
            window.location.href = '/login'; 
          }
        }
      });
  }

  deleteUser(userEmail: string) {
    if (userEmail === this.loggedInUserEmail) {
      alert("You cannot delete yourself!");
      return;
    }
    
    if (confirm(`Are you sure you want to delete the user with email: ${userEmail}?`)) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

      this.http.delete(`${this.apiUrl}/auth/users/email/${userEmail}`, { headers })  
        .subscribe({
          next: () => {
            this.users = this.users.filter(user => user.email !== userEmail);
            alert("User deleted successfully");
          },
          error: (err) => console.error("Failed to delete user:", err)
        });
    }
  }
}
