import { IFieldResolver } from 'graphql-tools';
import { EmptyParent, ContextWithRequestResponse } from '../../types/common.type';
import { MUTATION_TYPE,CreatePostArgs, PostUpdateArgs, DeleteArgs } from '../../types/mutation.type';
import { PostSubscriptionPayload } from '../../types/subscription.type';
import { PubSub } from 'graphql-yoga';
import { Post } from '@prisma/client';

const createPost: IFieldResolver<EmptyParent, ContextWithRequestResponse, CreatePostArgs > = async(parent, args, { prisma, pubSub }, info) => {
  const { title, body, author, published } = args.data;
  const authorExists = await prisma.user.findOne({
    where:{
      id: author
    }
  })
  if(authorExists){
    const newPost = await prisma.post.create({
      data:{
        title,
        body,
        published,
        author:{
          connect:{
            id: author
          }
        }
      }
    })
    publishPostMutation(pubSub, MUTATION_TYPE.CREATE, newPost);
    return newPost;
  }else{
    throw new Error("User is not registered!")
  }
}

const updatePost: IFieldResolver<EmptyParent, ContextWithRequestResponse, PostUpdateArgs> = async(parent, args, { prisma, pubSub }, info)=>{
  const { postID, data } = args;
  const postToUpdate = await prisma.post.findOne({
    where:{
      id: postID
    }
  })
  if(postToUpdate){
    const updatedPost = await prisma.post.update({
      where:{
        id: postID
      },
      data
    })
    publishPostMutation(pubSub, MUTATION_TYPE.UPDATE, postToUpdate);
    return updatedPost;
  }else{
    throw new Error("Post does not exist!");
  }
}

const deletePost: IFieldResolver<EmptyParent, ContextWithRequestResponse, DeleteArgs> = async(parent, args, { prisma, pubSub }, info) => {
  const { postID } = args;
  const postExists = await prisma.post.findOne({
    where:{
      id: postID
    }
  })
  if(postExists){
    const updatedPost = await prisma.post.update({
      where:{
        id: postID
      },
      data:{
        comments:{
          deleteMany:{
            postId: postID
          }
        }
      }
    })
    const deletedPost = await prisma.post.delete({
      where:{
        id: postID
      }
    }) 
    publishPostMutation(pubSub, MUTATION_TYPE.DELETE, deletedPost);
    return deletedPost;
  }else{
    throw new Error("Post does nto exist!");
  }
}


function publishPostMutation(pubSub: PubSub, mutationType: MUTATION_TYPE, mutatedPost: Post){
  const postSubscriptionPayload: PostSubscriptionPayload = {
    post: {
      mutation: mutationType,
      data: mutatedPost
    }
  }
  pubSub.publish(mutatedPost.authorId,postSubscriptionPayload);
}

export {
  createPost,
  updatePost,
  deletePost
}