import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {jwtDecode} from 'jwt-decode';
import { environment } from '../../environments/environment';


interface LoginResponse {
  token: string;
  role: string;
  userId: number;
  email: string;
  name: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  joinDate: string;
}

interface Record {
  id: number;
  title: string;
  description: string;
  accessLevel: 'Admin' | 'General';
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          const decodedToken: any = jwtDecode(response.token);
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify({
            username: decodedToken.username,
            email: decodedToken.email,
            role: decodedToken.role,
          }));
        }
      })
    );
  }

  register(user: any, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/auth/register`, user, { headers });
  }

  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getUserData(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getUserRecords(): Observable<Record[]> {
    const user = this.getUserData();
    
    const isAdmin = user?.role === 'Admin';
    
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  
    return this.http.get<Record[]>(`${this.apiUrl}/auth/records`, { headers }).pipe(
      // tap((records) => {
      //   console.log('Fetched records:', records);
      // })
    );
  }
  

  isAdmin(): boolean {
    const user = this.getUserData();
    return user?.role === 'Admin';
  }
}