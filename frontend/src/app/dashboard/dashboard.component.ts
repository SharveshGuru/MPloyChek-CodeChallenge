import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  records: any[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getUserData();
    if (!this.user) {
      this.router.navigate(['/login']);
      return;
    }

    this.authService.getUserRecords().subscribe({
      next: (records) => {
        this.records = records.map(record => ({
          ...record,
          createdAt: this.formatDate(record.createdAt)
        }));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load records', err);
        this.isLoading = false;
      }
    });
  }

  // Helper method to format date
  formatDate(dateString: string): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(dateString, 'dd MMMM yyyy') || dateString;
  }

  isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }

  deleteRecord(recordId: string) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.authService.deleteRecord(recordId).subscribe({
        next: () => {
          this.records = this.records.filter(record => record.id !== recordId);
          alert('Record deleted successfully');
          this.authService.getUserRecords().subscribe({
            next: (records) => {
              this.records = records.map(record => ({
                ...record,
                createdAt: this.formatDate(record.createdAt)
              }));
              this.isLoading = false;
            },
            error: (err) => {
              console.error('Failed to load records', err);
              this.isLoading = false;
            }
          });

        },
        error: (err) => {
          console.error('Failed to delete record', err);
          alert('Error deleting record');
        }
      });
    }
  }

  logout() {
    this.authService.clearAuthData();
    this.router.navigate(['/login']);
  }
}