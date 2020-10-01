import { IResolverObject } from 'graphql-tools';
import { Post } from '@prisma/client';
import { Context, EmptyArgs } from '../../types/common.type';

const Post: IResolverObject<Post, Context, EmptyArgs> = {
  async author(parent, args, { prisma }, info){
    console.log(" I WAS CALLED MAN!")
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