import { IResolverObject } from 'graphql-tools';
import { Post } from '../../db';
import { Context, EmptyArgs } from '../../types/common.type';

const Post: IResolverObject<Post, Context, EmptyArgs> = {
  author(parent, args, { db }, info){
    return db.dummyUsers.find(user=>user.id === parent.author)
  },
  comments(parent, args, { db }, info){
    return db.dummyComments.filter( comment => comment.post === parent.id )
  }
}

export { Post };