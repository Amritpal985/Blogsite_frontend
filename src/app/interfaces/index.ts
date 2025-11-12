export interface LoginUser {
  access_token: string;
  token_type: string;
  user_id: string;
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

export interface GetAllPostResponse {
  result: Post[];
  totalPosts: number;
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

export interface Follower {
  id: number;
  username: string;
}

export interface ChatMessage {
  id?: number;
  receiver_id: number;
  sender_id?: number;
  is_read?: boolean;
  message: string;
  timestamp?: string;
}

export interface Message {
  receiver_id: number;
  message: string;
}

export interface User {
  id: number;
  username: string;
  fullname: string;
  email: string;
  about_me: string;
  image: string;
  total_posts: string;
  followers: number;
  following: number;
}
