import { IResolverObject } from 'graphql-tools';
import { ClientStore, ContextWithRequestResponse, EmptyArgs } from '../../types/common.type';
import { User } from '@prisma/client';

const User: IResolverObject<User, ContextWithRequestResponse, EmptyArgs> = {
  email(parent, args, {authenticateUser, request}, info){
    const currentUserID = parent.id;
    try{
      const authenticatedUserID = authenticateUser(request.headers as ClientStore);
      return currentUserID === authenticatedUserID ? parent.email : null;
    }catch{
      return null;
    }
  },
  async posts(parent, args, { prisma }, info){
    const userPosts = await prisma.post.findMany({
      where:{
        authorId: parent.id,
        published: true
      }
    })
    return userPosts;
  },
  async comments(parent, args, { prisma }, info){
    const userComments = await prisma.comment.findMany({
      where: {
        authorId: parent.id
      }
    })
    return userComments;
  }
};

export { User };

