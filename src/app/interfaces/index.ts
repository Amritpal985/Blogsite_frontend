export interface LoginUser {
  access_token: string;
  token_type: string;
}

export interface Posts {
  id: number;
  title: string;
  content: string;
  created_at: string;
  author: {
    id: number;
    username: string;
  };
}
