import { IFieldResolver } from 'graphql-tools';
import { EmptyParent, ContextWithRequestResponse, AuthTokenPayload, ClientStore } from '../../types/common.type';
import { MUTATION_TYPE,CreatePostArgs, PostUpdateArgs, DeleteArgs, DeletePostArgs } from '../../types/mutation.type';
import { PostSubscriptionPayload } from '../../types/subscription.type';
import { PubSub } from 'graphql-yoga';
import { Post } from '@prisma/client';

const createPost: IFieldResolver<EmptyParent, ContextWithRequestResponse, CreatePostArgs > = async(parent, args, { prisma, pubSub, request, authenticateUser }, info) => {
  const authorID = authenticateUser(request.headers as ClientStore);
  const { title, body, published } = args.data;
  const authorExists = await prisma.user.findOne({
    where:{
      id: authorID
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
            id: authorID
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

const updatePost: IFieldResolver<EmptyParent, ContextWithRequestResponse, PostUpdateArgs> = async(parent, args, { prisma, pubSub, request, authenticateUser }, info)=>{
  const userID = authenticateUser(request.headers as ClientStore);
  const { postID, data } = args;
  const [postToUpdate] = await prisma.post.findMany({
    where:{
      AND:[
        {
          id: postID
        },
        {
          authorId: userID
        }
      ]
    }
  })
  if(postToUpdate){
    if(!data.published && postToUpdate.published){
      await prisma.post.update({
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
    }
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

const deletePost: IFieldResolver<EmptyParent, ContextWithRequestResponse, DeletePostArgs> = async(parent, args, { prisma, pubSub, request, authenticateUser }, info) => {
  const userID = authenticateUser(request.headers as ClientStore);
  const { postID } = args;
  const [postExists] = await prisma.post.findMany({
    where:{
      AND:[
        {
          id: postID
        },
        {
          authorId: userID
        }
      ]
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
    throw new Error("Post does not exist!");
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