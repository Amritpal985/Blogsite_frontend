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
  tags: string;
  formatted_tags?: string[];
  author: {
    id: number;
    username: string;
  };
  image?: string | null;
  like_count?: number;
  comments_count?: number;
}

export interface CommentNode {
  id: number;
  author_name: string;
  content: string;
  children?: CommentNode[];
}

export interface CommentResponse {
  message: string;
  comment: CommentNode;
}
