import { prismaVersion } from '@prisma/client';
import { IResolverObject, IResolverOptions } from 'graphql-tools';
import { EmptyParent, Context} from '../../types/common.type';
import { CommentSubscriptionArgs, PostSubscriptionArgs } from '../../types/subscription.type';

const comment: IResolverOptions<EmptyParent, Context, CommentSubscriptionArgs> = {
  async subscribe(parent, { postID }, { prisma, pubSub }, info){
    const postToSubscribeTo = await prisma.post.findOne({
      where:{
        id: postID
      }
    })
    if(postToSubscribeTo){
      console.log("Subscribed to the post");
      return pubSub.asyncIterator(postID);
    }else{
      throw new Error("Post does not exist!")
    }
  }
}

const post: IResolverOptions<EmptyParent, Context, PostSubscriptionArgs> = {
  async subscribe(parent, { userID }, { prisma, pubSub }, info){
    const userToSubscribeTo = await prisma.user.findOne({
      where:{
        id: userID
      }
    })
    if(userToSubscribeTo){
      return pubSub.asyncIterator(userID);
    }else{
      throw new Error("User does not exist!")
    }
  }
} 

const Subscription: IResolverObject = {
  comment,
  post
}

export { Subscription };