import { uuid } from 'uuidv4';
import { IResolverObject, IFieldResolver } from 'graphql-tools';
import { MUTATION_TYPE,CreateUserArgs, CreatePostArgs, CreateCommentArgs, DeleteArgs, UserUpdateArgs, PostUpdateArgs, CommentUpdateArgs } from '../../types/mutation.type';
import { Context, EmptyParent } from '../../types/common.type';
import { CommentSubscriptionPayload, PostSubscriptionPayload } from '../../types/subscription.type';

const createUser: IFieldResolver<EmptyParent, Context, CreateUserArgs> = (parent, args, { db }, info) => {
  const { data:{email} } = args;
    if( db.dummyUsers.some( user => user.email === email) ){
      throw new Error('User already registered!')
    }else{
      const newUser = {
        id: uuid(),
        ...args.data,
        active: false
      }
      db.dummyUsers.push(newUser);
      return newUser;
    }
}

const updateUser: IFieldResolver<EmptyParent, Context, UserUpdateArgs> = (parent, args, { db }, info ) => {
  const { userID, data } = args;
  const userToUpdate = db.dummyUsers.find( user => user.id === userID);
  if(userToUpdate){
    for (const updateKey in data) {
      const updateValue = data[updateKey];
      if(updateKey ==="email" && db.dummyUsers.some( user => user.email === updateValue )){
        throw new Error("Email is already in use!");
      }else if (updateValue){
        userToUpdate[updateKey] = updateValue;
      }
    }
    return userToUpdate;
  }else{
    throw new Error("User does not exist!");
  }
}

const deleteUser: IFieldResolver<EmptyParent, Context, DeleteArgs> = (parent, args, { db }, info) => {
  const {userID} = args;
  const userIndex = db.dummyUsers.findIndex( user => user.id === userID );
  const userExists = userIndex >= 0;
  if(userExists){
    const deletedUser = db.dummyUsers.splice(userIndex, 1)[0];

    db.dummyPosts = db.dummyPosts.filter( post => {
      const postByUser = post.author === userID;
      if(postByUser){
        db.dummyComments = db.dummyComments.filter( comment => comment.post !== post.id );
      }
      return !postByUser;
    })

    db.dummyComments = db.dummyComments.filter( comment => comment.author !== userID );

    return deletedUser;
  }else{
    throw new Error("User does not exist!")
  }
}

const createPost: IFieldResolver<EmptyParent, Context, CreatePostArgs > = (parent, args, { db, pubSub }, info) => {
  const {author} = args.data;
  if(db.dummyUsers.some( user => user.id === author )){
    const newPost = {
      id: uuid(),
      ...args.data
    }
    db.dummyPosts.push(newPost);
    const postSubscriptionPayload: PostSubscriptionPayload = {
      post: newPost
    }
    pubSub.publish(author,postSubscriptionPayload);
    return newPost;
  }else{
    throw new Error("User is not registered!")
  }
}

const updatePost: IFieldResolver<EmptyParent, Context, PostUpdateArgs> = (parent, args, { db }, info)=>{
  const { postID, data } = args;
  const postToUpdate = db.dummyPosts.find( post => post.id === postID );
  if(postToUpdate){
    for (const updateKey in data) {
      const updateValue = data[updateKey];
      if(updateValue){
        postToUpdate[updateKey] = updateValue;
      }
    }
    return postToUpdate;
  }else{
    throw new Error("Post does not exist!");
  }
}

const deletePost: IFieldResolver<EmptyParent, Context, DeleteArgs> = (parent, args, { db }, info) => {
  const {postID} = args;
  const postIndex = db.dummyPosts.findIndex( post => post.id === postID );
  const postExists = postIndex >= 0;
  if(postExists){
    const deletedPost = db.dummyPosts.splice(postIndex, 1)[0];
    db.dummyComments = db.dummyComments.filter( comment => comment.post !== postID );
    return deletedPost;
  }else{
    throw new Error("Post does nto exist!");
  }
}

const createComment: IFieldResolver<EmptyParent, Context, CreateCommentArgs> = (parent, args, { db, pubSub }, info) => {
  const {post, author} = args.data;
  const postPublished = db.dummyPosts.some( savedPost => savedPost.id === post && savedPost.published );
  const userExists = db.dummyUsers.some( user => user.id === author );
  if(postPublished && userExists){
    const newComment = {
      id: uuid(),
      ...args.data
    }
    db.dummyComments.push(newComment);
    const commentSubscriptionPayload: CommentSubscriptionPayload = {
      comment: {
        mutation: MUTATION_TYPE.CREATE,
        data: newComment
      }
    }
    pubSub.publish(post,commentSubscriptionPayload);
    return newComment;
  }else{
    throw new Error("Post is unpublished or User does not exist!")
  }
}

const updateComment: IFieldResolver<EmptyParent, Context, CommentUpdateArgs> = (parent, args, { db, pubSub }, info)=>{
  const { commentID, data } = args;
  const commentToUpdate = db.dummyComments.find( comment => comment.id === commentID );
  if(commentToUpdate){
    for (const updateKey in data) {
      const updateValue = data[updateKey];
      if(updateValue){
        commentToUpdate[updateKey] = updateValue;
      }
    }
    const commentSubscriptionPayload: CommentSubscriptionPayload = {
      comment: {
        mutation: MUTATION_TYPE.UPDATE,
        data: commentToUpdate
      }
    }
    pubSub.publish(commentToUpdate.post,commentSubscriptionPayload);
    return commentToUpdate;
  }else{
    throw new Error("Comment does not exist!")
  }
}

const deleteComment: IFieldResolver<EmptyParent, Context, DeleteArgs> = (parent, args, { db, pubSub }, info) => {
  const {commentID} = args;
  const commentIndex = db.dummyComments.findIndex( comment => comment.id === commentID );
  const commentExists = commentIndex >= 0;
  if(commentExists){
    const deletedComment = db.dummyComments.splice(commentIndex, 1)[0];
    const commentSubscriptionPayload: CommentSubscriptionPayload = {
      comment: {
        mutation: MUTATION_TYPE.DELETE,
        data: deletedComment
      }
    }
    pubSub.publish(deletedComment.post,commentSubscriptionPayload);
    return deletedComment;
  }else{
    throw new Error("Comment does not exist!");
  }
}

const Mutation: IResolverObject = {
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