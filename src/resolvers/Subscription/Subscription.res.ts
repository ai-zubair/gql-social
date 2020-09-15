import { IResolverObject, IResolverOptions } from 'graphql-tools';
import { EmptyParent, Context} from '../../types/common.type';
import { CommentSubscriptionArgs, PostSubscriptionArgs } from '../../types/subscription.type';

const comment: IResolverOptions<EmptyParent, Context, CommentSubscriptionArgs> = {
  subscribe(parent, { postID }, { db, pubSub }, info){
    const postToSubscribeTo = db.dummyPosts.find( post => post.id === postID );
    if(postToSubscribeTo){
      return pubSub.asyncIterator(postID);
    }else{
      throw new Error("Post does not exist!")
    }
  }
}

const post: IResolverOptions<EmptyParent, Context, PostSubscriptionArgs> = {
  subscribe(parent, { userID }, { db, pubSub }, info){
    const userToSubscribeTo = db.dummyUsers.find( user => user.id === userID );
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