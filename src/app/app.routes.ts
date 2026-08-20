import { Routes } from '@angular/router';
import { authGuard, pageLeaveCheck } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'posts',
    pathMatch: 'full',
    loadComponent: () => import('./components/posts/posts.component').then((m) => m.PostsComponent),
  },
  {
    path: 'add-post',
    pathMatch: 'full',
    canActivate: [authGuard],
    canDeactivate: [pageLeaveCheck],
    loadComponent: () =>
      import('./components/add-post/add-post.component').then((m) => m.AddPostComponent),
  },
  {
    path: 'post/:id',
    pathMatch: 'full',
    loadComponent: () => import('./components/post/post.component').then((m) => m.PostComponent),
  },
  {
    path: 'user-profile',
    pathMatch: 'full',
    loadComponent: () =>
      import('./components/user-profile/user-profile.component').then(
        (m) => m.UserProfileComponent
      ),
  },
];
