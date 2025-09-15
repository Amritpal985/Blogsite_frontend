import { Component, inject, OnInit } from '@angular/core';
import { Posts } from '../../interfaces';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../constants';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// import { mockData } from '../../mock-data';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit {
  private _http = inject(HttpClient);

  allPosts: Posts[] = [];

  ngOnInit(): void {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    // this.allPosts = mockData;
    this._http.get<Posts[]>(Constants.ALL_POSTS, { headers }).subscribe(
      (res) => {
        this.allPosts = res;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
