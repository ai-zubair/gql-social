import { uuid } from 'uuidv4';
import { IFieldResolver } from 'graphql-tools';
import { MUTATION_TYPE, CreateCommentArgs, DeleteArgs, CommentUpdateArgs } from '../../types/mutation.type';
import { Context, EmptyParent } from '../../types/common.type';
import { CommentSubscriptionPayload } from '../../types/subscription.type';
import { PubSub } from 'graphql-yoga';
import { Comment } from '../../db';

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
    publishCommentMutation(pubSub, MUTATION_TYPE.CREATE, newComment);
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
    publishCommentMutation(pubSub, MUTATION_TYPE.UPDATE, commentToUpdate);
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
    publishCommentMutation(pubSub, MUTATION_TYPE.DELETE, deletedComment);
    return deletedComment;
  }else{
    throw new Error("Comment does not exist!");
  }
}

function publishCommentMutation(pubSub: PubSub, mutationType: MUTATION_TYPE, mutatedComment: Comment){
  const commentSubscriptionPayload: CommentSubscriptionPayload = {
    comment: {
      mutation: mutationType,
      data: mutatedComment
    }
  }
  pubSub.publish(mutatedComment.post,commentSubscriptionPayload);
}

export {
  createComment,
  updateComment,
  deleteComment
}