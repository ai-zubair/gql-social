export interface UserData{
  name: string;
  email: string;
}

export interface CreateUserArgs{
  data: UserData;
}
export interface PostData{
  title: string;
  body: string;
  author: string;
  published: boolean;
}
export interface CreatePostArgs{
  data: PostData;
}
export interface CommentData{
  text: string;
  post: string;
  author: string;
}
export interface CreateCommentArgs{
  data: CommentData;
}

export interface DeleteArgs{
  userID?: string;
  postID?: string;
  commentID?: string;
}