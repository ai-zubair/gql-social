import { IResolverObject, IFieldResolver } from 'graphql-tools';
import { Context, ContextWithRequestResponse, EmptyArgs, EmptyParent } from '../../types/common.type';

interface QueryArgs{
  keyword: string;
}

interface PostQueryArgs{
  postID: string;
}

const post: IFieldResolver<EmptyParent, ContextWithRequestResponse, PostQueryArgs> = async(parent, {postID}, {prisma, authenticateUser, request}, info)=>{
  let requestedPost = await prisma.post.findOne({
    where:{
      id: postID
    }
  });
  if(!requestedPost){
    throw new Error("Post does not exist!")
  }
  if(requestedPost.published){
    return requestedPost;
  }else{
    const userID = authenticateUser(request);
    const [userDraft] = await prisma.post.findMany({
      where:{
        AND:[
          {
            id: postID
          },
          {
            authorId: userID
          }
        ]
      }
    });
    return userDraft;
  }
}

const posts: IFieldResolver<EmptyParent, ContextWithRequestResponse, QueryArgs> = async(parent, args, { prisma }, info)=>{
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
}

const users: IFieldResolver<EmptyParent, ContextWithRequestResponse, QueryArgs> = async(parent, args, { prisma }, info)=>{
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
}

const comments: IFieldResolver<EmptyParent, ContextWithRequestResponse, EmptyArgs> = async(parent, args, { prisma }, info)=>{
  const comments = await prisma.comment.findMany();
  return comments;
}

const Query = { 
  posts,
  post,
  users,
  comments
 };

 export { Query };