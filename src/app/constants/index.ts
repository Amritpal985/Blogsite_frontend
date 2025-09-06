export class Constants {
  // urls
  public static readonly CREATE_USER = 'http://localhost:8000/users/signup';
  public static readonly LOGIN_USER = 'http://localhost:8000/users/login';

  // messages
  public static readonly LOGIN_MSG = 'User LoggedIn Successfully.';
  public static readonly USER_CREATED_MSG = 'User created Successfully.';
  public static readonly PASSWORDS_MISMATCH_MSG = 'Passwords do not match.';
  public static readonly INVALID_FORM_MSG = 'Some fields are invalid.';
  public static readonly GENERIC_MSG = 'Something went wrong.';

  // snackbar classes
  public static readonly SNACKBAR_SUCCESS = 'snackbar-success';
  public static readonly SNACKBAR_WARNING = 'snackbar-warning';
  public static readonly SNACKBAR_ERROR = 'snackbar-error';
}
