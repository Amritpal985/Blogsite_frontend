export interface LoginUser {
  access_token: string;
  token_type: string;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
  tag: string;
  formatted_tags?: string[];
  author: {
    id: number;
    username: string;
  };
  image?: string;
}
