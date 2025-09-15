export interface LoginUser {
  access_token: string;
  token_type: string;
}

export interface Posts {
  title: string;
  content: string;
  image: string;
  created_at: string;
}