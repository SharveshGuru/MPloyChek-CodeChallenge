import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user: any = null;
  records: any[] = [];
  isLoading = true;
  showAddModal = false;
  showEditModal = false;
  
  newRecord: any = {
    title: '',
    description: '',
    accessLevel: 'General'
  };
  
  editingRecord: any = {
    _id: '',
    title: '',
    description: '',
    accessLevel: 'General'
  };

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

    this.loadRecords();
  }

  loadRecords() {
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

  formatDate(dateString: string): string {
    const datePipe = new DatePipe('en-US');
    return datePipe.transform(dateString, 'dd MMMM yyyy') || dateString;
  }

  isAdmin(): boolean {
    return this.user?.role === 'Admin';
  }

  openAddRecordModal() {
    this.newRecord = {
      title: '',
      description: '',
      accessLevel: 'General'
    };
    this.showAddModal = true;
  }

  openEditRecordModal(record: any) {
    this.editingRecord = {
      _id: record._id,
      title: record.title,
      description: record.description,
      accessLevel: record.accessLevel
    };
    this.showEditModal = true;
  }

  closeModal() {
    this.showAddModal = false;
    this.showEditModal = false;
  }

  addRecord() {
    this.authService.addRecord(this.newRecord).subscribe({
      next: (response) => {
        this.loadRecords();
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to add record', err);
        alert('Error adding record');
      }
    });
  }

  updateRecord() {
    this.authService.updateRecord(this.editingRecord._id, this.editingRecord).subscribe({
      next: (response) => {
        this.loadRecords();
        this.closeModal();
      },
      error: (err) => {
        console.error('Failed to update record', err);
        alert('Error updating record');
      }
    });
  }

  deleteRecord(recordId: string) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.authService.deleteRecord(recordId).subscribe({
        next: () => {
          this.loadRecords();
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