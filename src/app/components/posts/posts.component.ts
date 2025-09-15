import { Component, inject, OnInit } from '@angular/core';
import { Posts } from '../../interfaces';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Constants } from '../../constants';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-posts',
  standalone: true,
  imports: [CommonModule, HttpClientModule, MatCardModule, MatButtonModule],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss',
})
export class PostsComponent implements OnInit {
  private _http = inject(HttpClient);

  allPosts: Posts[] = [];

  ngOnInit(): void {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${localStorage.getItem('token')}`);

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
