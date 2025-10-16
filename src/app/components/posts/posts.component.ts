import { Component, inject, OnInit } from '@angular/core';
import { GetAllPostResponse, Post } from '../../interfaces';
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
import DOMPurify from 'dompurify';

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
  totalPosts = 0;

  page_number = 1;
  readonly page_size = 2;

  ngOnInit(): void {
    // this.allPosts = mockData;
    this.page_number = 1;
    this.fetchPosts(this.page_number);
  }

  /**
   * It fetches posts.
   * @param page_number of current page.
   */
  fetchPosts(page_number: number) {
    this.isLoading = true;
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const url = `${Constants.ALL_POSTS}?page_number=${page_number}`;
    this._http.get<GetAllPostResponse>(url, { headers }).subscribe(
      (res: GetAllPostResponse) => {
        this.allPosts = res.result.map((post) => {
          return {
            ...post,
            content: DOMPurify.sanitize(post.content, {
              ALLOWED_TAGS: ['b', 'i', 'a', 'ul', 'li'],
            }),
          };
        });
        this.totalPosts = res.totalPosts;
        this.isLoading = false;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }

  /**
   * It opens previous page of posts.
   */
  handlePrevClick() {
    if (this.page_number > 1) this.fetchPosts(--this.page_number);
  }

  /**
   * It opens next page of posts.
   */
  handleNextClick() {
    if (this.page_number * this.page_size <= this.totalPosts) this.fetchPosts(++this.page_number);
  }

  /**
   * It opens a particular post.
   * @param postId of the post.
   */
  openPost(postId: number) {
    this.router.navigate(['/post', postId]);
  }
}
