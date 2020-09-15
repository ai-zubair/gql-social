import { uuid } from 'uuidv4';
import { IFieldResolver } from 'graphql-tools';
import { EmptyParent, Context } from '../../types/common.type';
import { MUTATION_TYPE,CreatePostArgs, PostUpdateArgs, DeleteArgs } from '../../types/mutation.type';
import { PostSubscriptionPayload } from '../../types/subscription.type';
import { PubSub } from 'graphql-yoga';
import { Post } from '../../db';

const createPost: IFieldResolver<EmptyParent, Context, CreatePostArgs > = (parent, args, { db, pubSub }, info) => {
  const {author} = args.data;
  if(db.dummyUsers.some( user => user.id === author )){
    const newPost = {
      id: uuid(),
      ...args.data
    }
    db.dummyPosts.push(newPost);
    publishPostMutation(pubSub, MUTATION_TYPE.CREATE, newPost);
    return newPost;
  }else{
    throw new Error("User is not registered!")
  }
}

const updatePost: IFieldResolver<EmptyParent, Context, PostUpdateArgs> = (parent, args, { db, pubSub }, info)=>{
  const { postID, data } = args;
  const postToUpdate = db.dummyPosts.find( post => post.id === postID );
  if(postToUpdate){
    for (const updateKey in data) {
      const updateValue = data[updateKey];
      if(updateValue){
        postToUpdate[updateKey] = updateValue;
      }
    }
    publishPostMutation(pubSub, MUTATION_TYPE.UPDATE, postToUpdate);
    return postToUpdate;
  }else{
    throw new Error("Post does not exist!");
  }
}

const deletePost: IFieldResolver<EmptyParent, Context, DeleteArgs> = (parent, args, { db, pubSub }, info) => {
  const {postID} = args;
  const postIndex = db.dummyPosts.findIndex( post => post.id === postID );
  const postExists = postIndex >= 0;
  if(postExists){
    const deletedPost = db.dummyPosts.splice(postIndex, 1)[0];
    db.dummyComments = db.dummyComments.filter( comment => comment.post !== postID );
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
  pubSub.publish(mutatedPost.author,postSubscriptionPayload);
}

export {
  createPost,
  updatePost,
  deletePost
}