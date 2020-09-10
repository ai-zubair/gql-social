import { IResolverObject } from 'graphql-tools';
import { Post } from '../db';
import { Context } from '..';

interface Args{
  
}

const Post: IResolverObject<Post, Context, Args> = {
  author(parent, args, { db }, info){
    return db.dummyUsers.find(user=>user.id === parent.author)
  },
  comments(parent, args, { db }, info){
    return db.dummyComments.filter( comment => comment.post === parent.id )
  }
}

export { Post };