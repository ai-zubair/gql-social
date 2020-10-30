import { IResolverObject } from 'graphql-tools';
import { Post } from '@prisma/client';
import { ContextWithRequestResponse, EmptyArgs } from '../../types/common.type';

const Post: IResolverObject<Post, ContextWithRequestResponse, EmptyArgs> = {
  async author(parent, args, { prisma }, info){
    const postAuthor = await prisma.user.findOne({
      where: {
        id: parent.authorId
      }
    })
    return postAuthor;
  },
  async comments(parent, args, { prisma }, info){
    const postComments = await prisma.comment.findMany({
      where:{
        postId: parent.id
      }
    })
    return postComments;
  }
}

export { Post };