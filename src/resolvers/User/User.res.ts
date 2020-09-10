import { IResolverObject } from 'graphql-tools';
import { User } from '../../db';
import { Context, EmptyArgs } from '../../types/common.type';

const User: IResolverObject<User, Context, EmptyArgs> = {
  posts(parent, args, { db }, info){
    return db.dummyPosts.filter( post => post.author === parent.id)
  },
  comments(parent, args, { db }, info){
    return db.dummyComments.filter( comment => comment.author === parent.id )
  }
};

export { User };

