import { IResolverObject } from 'graphql-tools';
import { ContextWithRequestResponse, EmptyArgs } from '../../types/common.type';
import { User } from '@prisma/client';

const User: IResolverObject<User, ContextWithRequestResponse, EmptyArgs> = {
  async posts(parent, args, { prisma }, info){
    const userPosts = await prisma.post.findMany({
      where:{
        authorId: parent.id
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

