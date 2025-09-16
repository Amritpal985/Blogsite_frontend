import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { AddPostComponent } from '../components/add-post/add-post.component';

export const authGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const router = inject(Router);
  if (loginService.isUserLoggedIn()) return true;
  router.navigate(['']);
  return false;
};

export const pageLeaveCheck: CanDeactivateFn<AddPostComponent> = (component: AddPostComponent) => {
  if (component.hasUnsavedChanges()) return component.openPageLeavingConfirmation();
  return true;
};
