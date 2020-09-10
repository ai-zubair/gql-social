import { IResolverObject } from 'graphql-tools';
import { Context } from '../index';
import { Post, User, Comment } from '../db';

interface Parent{

}
interface QueryArgs{
  keyword: string;
}

const Query: IResolverObject<Parent, Context, QueryArgs>  = {
  posts(parent, args, { db }, info): Post[]{
    const keyword = args.keyword;
    if(keyword){ 
      return db.dummyPosts.filter( post => post.title.toLowerCase().includes(keyword.toLowerCase()) )
    }else{
      return db.dummyPosts;
    }
  },
  users(parent, args, { db }, info): User[]{
    const keyword = args.keyword;
    if(keyword){
      return db.dummyUsers.filter( user => user.name.toLowerCase().includes(keyword.toLowerCase()) )
    }else{
      return db.dummyUsers;
    }
  },
  comments(parent, args, { db }, info): Comment[]{
    return db.dummyComments;
  }
}

export { Query };