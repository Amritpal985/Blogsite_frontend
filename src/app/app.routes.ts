import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PostsComponent } from './components/posts/posts.component';
import { AddPostComponent } from './components/add-post/add-post.component';
import { authGuard, pageLeaveCheck } from './guards/auth.guard';
import { PostComponent } from './components/post/post.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeComponent,
  },
  {
    path: 'posts',
    pathMatch: 'full',
    component: PostsComponent,
  },
  {
    path: 'add-post',
    pathMatch: 'full',
    canActivate: [authGuard],
    canDeactivate: [pageLeaveCheck],
    component: AddPostComponent,
  },
  {
    path: 'post/:id',
    pathMatch: 'full',
    component: PostComponent,
  },
];
