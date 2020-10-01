import { Comment, Post } from '@prisma/client';

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
  post: {
    mutation: String;
    data: Post;
  };
}