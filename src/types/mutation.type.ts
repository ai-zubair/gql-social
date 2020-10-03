export enum MUTATION_TYPE{
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE"
}

export interface UserLoginData{
  email: string;
  password: string;
}

export interface UserLoginArgs{
  data: UserLoginData;
}

export interface UserData{
  name: string;
  email: string;
  password: string;
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
export interface UserDataUpdate{
  email?: string;
  name?: string;
  active?: boolean;
  [key: string]: string | boolean | undefined;
}

export interface UserUpdateArgs{
  userID: string;
  data: UserDataUpdate;
}

export interface PostDataUpdate{
  title?: string;
  body?: string;
  published?: boolean;
  [key: string]:  string | boolean | undefined;
}

export interface PostUpdateArgs{
  postID: string;
  data: PostDataUpdate;
}

export interface CommentDataUpdate{
  text: string;
  [key: string]: string | undefined;
}

export interface CommentUpdateArgs{
  commentID: string;
  data: CommentDataUpdate;
}
export interface DeleteArgs{
  userID?: string;
  postID?: string;
  commentID?: string;
}