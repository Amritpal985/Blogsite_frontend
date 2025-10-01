import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../../interfaces';
import { HttpClient } from '@angular/common/http';
import { Constants } from '../../constants';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { SpinnerComponent } from '../spinner/spinner.component';
import { PopupService } from '../../services/popup/popup.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, MatChipsModule, SpinnerComponent],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private _http = inject(HttpClient);
  private popupService = inject(PopupService);

  isLoading = false;
  postId: string | null = null;
  post!: Post;

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((params) => {
      this.postId = params.get('id');
    });
    const url = `${Constants.GET_POST}/${this.postId}`;
    this._http.get<Post>(url).subscribe(
      (res) => {
        this.post = res;
        this.post = { ...this.post, formatted_tags: this.post?.tags?.split(',') };
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.popupService.showAlertMessage(Constants.GENERIC_MSG, Constants.SNACKBAR_ERROR);
      }
    );
  }
}
