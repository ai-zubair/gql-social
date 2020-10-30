import { IResolverObject, IResolverOptions } from 'graphql-tools';
import { authenticateUser } from '../../context';
import { EmptyParent, ContextWithRequestResponse} from '../../types/common.type';
import { CommentSubscriptionArgs, PostSubscriptionArgs } from '../../types/subscription.type';

const comment: IResolverOptions<EmptyParent, ContextWithRequestResponse, CommentSubscriptionArgs> = {
  async subscribe(parent, { postID }, { prisma, pubSub, connection }, info){
    if(authenticateUser(connection.context)){
      const postToSubscribeTo = await prisma.post.findOne({
        where:{
          id: postID
        }
      })
      if(postToSubscribeTo){
        return pubSub.asyncIterator(postID);
      }else{
        throw new Error("Post does not exist!")
      }
    }
  }
}

const post: IResolverOptions<EmptyParent, ContextWithRequestResponse, PostSubscriptionArgs> = {
  async subscribe(parent, { userID }, { prisma, pubSub, connection }, info){
    if(authenticateUser(connection.context)){
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
} 

const Subscription: IResolverObject = {
  comment,
  post
}

export { Subscription };