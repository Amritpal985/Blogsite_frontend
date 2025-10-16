import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatFormFieldModule, MatCardModule, ReactiveFormsModule, MatListModule, MatIconModule, MatInputModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {
  user = {
    name: 'Jane Doe',
    username: 'janedoe',
    email: 'jane@example.com',
    bio: 'Tech enthusiast, blogger & designer.',
    joined: new Date('2021-01-15'),
    posts: 42
  };

  messages = [
    { from: 'Admin', text: 'Welcome to our blog platform!' },
    { from: 'John', text: 'Hey Jane, loved your latest post!' }
  ];

  profileForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      name: [this.user.name],
      bio: [this.user.bio]
    });
  }

  updateProfile() {
    const updated = this.profileForm.value;
    this.user.name = updated.name;
    this.user.bio = updated.bio;
    alert('Profile updated successfully!');
  }

}
