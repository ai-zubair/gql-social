import { IResolverObject } from 'graphql-tools';
import { Comment } from '../../db';
import { Context, EmptyArgs } from '../../types/common.type';

const Comment: IResolverObject<Comment, Context, EmptyArgs> = {
  author(parent, args, { db }, info){
    return db.dummyUsers.find( user => user.id === parent.author)
  },
  post(parent, args, { db }, info){
    return db.dummyPosts.find( post => post.id === parent.post)
  }
};

export { Comment };

