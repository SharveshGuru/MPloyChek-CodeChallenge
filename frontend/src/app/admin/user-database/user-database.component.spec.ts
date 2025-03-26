import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDatabaseComponent } from './user-database.component';

describe('UserDatabaseComponent', () => {
  let component: UserDatabaseComponent;
  let fixture: ComponentFixture<UserDatabaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserDatabaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDatabaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
