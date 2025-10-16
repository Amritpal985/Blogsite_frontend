export class Constants {
  // urls
  public static readonly CREATE_USER = 'http://localhost:8000/users/signup';
  public static readonly LOGIN_USER = 'http://localhost:8000/users/login';
  public static readonly ALL_POSTS = 'http://localhost:8000/posts';
  public static readonly GET_POST = 'http://localhost:8000/posts';
  public static readonly CREATE_POST = 'http://localhost:8000/posts/create_posts';
  public static readonly GET_COMMENTS = 'http://localhost:8000/comments';
  public static readonly ADD_COMMENT = 'http://localhost:8000/comments';
  public static readonly REPLY_TO_COMMENT = 'http://localhost:8000/comments/reply';
  public static readonly GET_ALL_FOLLOWERS = 'http://localhost:8000/follows/followers';
  public static readonly GET_CHAT_HISTORY = 'http://localhost:8000/chat/history';
  public static readonly SEND_MESSAGE_URL = 'http://localhost:8000/chat/send';
  public static readonly WEBSOCKET_MESSAGE_URL = 'ws://localhost:8000/chat/ws';

  // messages
  public static readonly LOGIN_MSG = 'Loggedin successfully. Welcome back.';
  public static readonly LOGOUT_MSG = 'Logout successfully. See you again!';
  public static readonly USER_CREATED_MSG = 'User created Successfully.';
  public static readonly PASSWORDS_MISMATCH_MSG = 'Passwords do not match.';
  public static readonly INVALID_FORM_MSG = 'Some fields are invalid.';
  public static readonly GENERIC_MSG = 'Some error has occurred. Please try again.';
  public static readonly POST_CREATED_MSG = 'Post created Successfully.';
  public static readonly USER_NOT_LOGGED_IN = 'You are not logged in. Please log in to continue.';
  public static readonly WEBSOCKET_ERROR_MSG = 'Websocket error.';

  // *********unsaved-data-warning*********
  public static readonly UNSAVED_DATA_WARNING_TITLE = 'Unsaved Changes.';
  public static readonly UNSAVED_DATA_WARNING_MSG = 'Are you sure you want to leave?';

  // snackbar classes
  public static readonly SNACKBAR_SUCCESS = 'snackbar-success';
  public static readonly SNACKBAR_WARNING = 'snackbar-warning';
  public static readonly SNACKBAR_ERROR = 'snackbar-error';
}
