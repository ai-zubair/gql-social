import { IResolverObject } from 'graphql-tools';
import { Context, EmptyParent } from '../../types/common.type';

interface QueryArgs{
  keyword: string;
}

const Query: IResolverObject<EmptyParent, Context, QueryArgs>  = {
  async posts(parent, args, { prisma }, info){
    const keyword = args.keyword;
    const postsWithFilter = await prisma.post.findMany({
      where: {
        OR:[
          {
            title: {
              contains: keyword
            }
          },
          {
            body: {
              contains: keyword
            }
          }
        ]
      }      
    })
    return postsWithFilter;
  },
  async users(parent, args, { prisma }, info){
    const keyword = args.keyword;
    const usersWithFilter = await prisma.user.findMany({
      where: {
        OR:[
          {
            name: {
              contains: keyword
            }
          },
          {
            email: {
              contains: keyword
            }
          }
        ]
      }
    })
    return usersWithFilter;
  },
  async comments(parent, args, { prisma }, info){
    const comments = await prisma.comment.findMany();
    return comments;
  }
}

export { Query };