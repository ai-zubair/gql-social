import { IResolverObject } from 'graphql-tools';
import { Comment, prismaVersion } from '@prisma/client';
import { Context, EmptyArgs } from '../../types/common.type';

const Comment: IResolverObject<Comment, Context, EmptyArgs> = {
  async author(parent, args, { prisma ,db }, info){
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

