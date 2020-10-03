import { IResolverObject } from 'graphql-tools';
import { Comment, prismaVersion } from '@prisma/client';
import { ContextWithRequestResponse, EmptyArgs } from '../../types/common.type';

const Comment: IResolverObject<Comment, ContextWithRequestResponse, EmptyArgs> = {
  async author(parent, args, { prisma }, info){
    const commentAuthor = await prisma.user.findOne({
      where:{
        id: parent.authorId
      }
    })
    return commentAuthor;
  },
  async post(parent, args, { prisma }, info){
    const commentPost = await prisma.post.findOne({
      where:{
        id: parent.postId
      }
    })
    return commentPost;
  }
};

export { Comment };

