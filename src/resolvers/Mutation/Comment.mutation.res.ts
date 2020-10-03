import { IFieldResolver } from 'graphql-tools';
import { MUTATION_TYPE, CreateCommentArgs, DeleteArgs, CommentUpdateArgs } from '../../types/mutation.type';
import { ContextWithRequestResponse, EmptyParent } from '../../types/common.type';
import { CommentSubscriptionPayload } from '../../types/subscription.type';
import { PubSub } from 'graphql-yoga';
import { Comment } from '@prisma/client';

const createComment: IFieldResolver<EmptyParent, ContextWithRequestResponse, CreateCommentArgs> = async(parent, args, { prisma, pubSub }, info) => {
  const {post, author, text} = args.data;
  const targetPost = await prisma.post.findOne({
    where: {
      id: post
    },
    select: {
      published: true
    }
  })
  const userExists = await prisma.user.findOne({
    where: {
      id: author
    }
  })
  if(targetPost?.published && userExists){
    const newComment = await prisma.comment.create({
      data: {
        text,
        author:{
          connect:{
            id: author
          }
        },
        post:{
          connect:{
            id: post
          }
        }
      }
    })
    publishCommentMutation(pubSub, MUTATION_TYPE.CREATE, newComment)
    return newComment;
  }else{
    throw new Error("Post is unpublished or User does not exist!")
  }
}

const updateComment: IFieldResolver<EmptyParent, ContextWithRequestResponse, CommentUpdateArgs> = async (parent, args, { prisma, pubSub }, info)=>{
  const { commentID, data } = args;
  const commentToUpdate = await prisma.comment.findOne({
    where:{
      id: commentID
    }
  })
  if(commentToUpdate){
    const updatedComment = await prisma.comment.update({
      where:{
        id: commentID
      },
      data
    })
    publishCommentMutation(pubSub, MUTATION_TYPE.UPDATE, updatedComment);
    return updatedComment;
  }else{
    throw new Error("Comment does not exist!")
  }
}

const deleteComment: IFieldResolver<EmptyParent, ContextWithRequestResponse, DeleteArgs> = async(parent, args, { prisma, pubSub }, info) => {
  const {commentID} = args;
  const commentExists = await prisma.comment.findOne({
    where:{
      id: commentID
    }
  })
  if(commentExists){
    const deletedComment = await prisma.comment.delete({
      where:{
        id: commentID
      }
    })
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
  pubSub.publish(mutatedComment.postId,commentSubscriptionPayload);
}

export {
  createComment,
  updateComment,
  deleteComment
}