import { inject } from '@angular/core';
import { CanActivateFn, CanDeactivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login/login.service';
import { AddPostComponent } from '../components/add-post/add-post.component';
import { PopupService } from '../services/popup/popup.service';
import { Constants } from '../constants';

export const authGuard: CanActivateFn = () => {
  const loginService = inject(LoginService);
  const popupService = inject(PopupService);
  const router = inject(Router);
  if (loginService.isUserLoggedIn()) return true;
  popupService.showAlertMessage(Constants.USER_NOT_LOGGED_IN, Constants.SNACKBAR_WARNING);
  router.navigate(['']);
  return false;
};

export const pageLeaveCheck: CanDeactivateFn<AddPostComponent> = (component: AddPostComponent) => {
  if (component.hasUnsavedChanges()) return component.openPageLeavingConfirmation();
  return true;
};
