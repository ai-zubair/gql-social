import { IResolverObject } from 'graphql-tools';
import { createUser, updateUser, deleteUser, loginUser } from './User.mutation.res';
import { createPost, updatePost, deletePost } from './Post.mutation.res';
import { createComment, updateComment, deleteComment } from './Comment.mutation.res';


const Mutation: IResolverObject = {
  loginUser,
  createUser,
  updateUser,
  deleteUser,
  createPost,
  updatePost,
  deletePost,
  createComment,
  updateComment,
  deleteComment
}

export { Mutation };