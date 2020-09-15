import { Comment, Post } from '../db';

export interface CommentSubscriptionArgs{
  postID: string;
}

export interface CommentSubscriptionPayload{
  comment:{
    mutation: String;
    data: Comment;
  }
}

export interface PostSubscriptionArgs{
  userID: string;
} 

export interface PostSubscriptionPayload{
  post: Post;
}