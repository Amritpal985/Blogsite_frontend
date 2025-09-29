import { Component, inject, OnInit } from '@angular/core';
import { Post } from '../../interfaces';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../constants';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { mockData } from '../../mock-data';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../spinner/spinner.component';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    SpinnerComponent,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit {
  private _http = inject(HttpClient);
  private router = inject(Router);

  isLoading = false;
  allPosts: Post[] = [];

  ngOnInit(): void {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    // this.allPosts = mockData;
    this.isLoading = true;
    this._http.get<Post[]>(Constants.ALL_POSTS, { headers }).subscribe(
      (res) => {
        this.allPosts = res;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  openPost(postId: number) {
    this.router.navigate(['/post', postId]);
  }
}
