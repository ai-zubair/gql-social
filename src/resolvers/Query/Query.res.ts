import { IResolverObject, IFieldResolver } from 'graphql-tools';
import { ClientStore, Context, ContextWithRequestResponse, EmptyArgs, EmptyParent } from '../../types/common.type';

interface QueryArgs{
  keyword: string;
}

interface PostQueryArgs{
  postID: string;
}

const me: IFieldResolver<EmptyParent, ContextWithRequestResponse, EmptyArgs> = async(parent, args, {prisma, authenticateUser, request}, info)=>{
  const userID = authenticateUser(request.headers as ClientStore);
  const userProfile = await prisma.user.findOne({
    where:{
      id: userID
    }
  });
  return userProfile;
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
    const userID = authenticateUser(request.headers as ClientStore);
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

const myPosts: IFieldResolver<EmptyParent, ContextWithRequestResponse, QueryArgs> = async(parent, {keyword}, {prisma, authenticateUser, request}, info)=>{
  const userID = authenticateUser(request.headers as ClientStore);
  const userPosts = await prisma.post.findMany({
    where:{
      authorId: userID,
      title:{
        contains: keyword
      }
    }
  })
  return userPosts;
}

const posts: IFieldResolver<EmptyParent, ContextWithRequestResponse, QueryArgs> = async(parent, args, { prisma }, info)=>{
  const keyword = args.keyword;
  const postsWithFilter = await prisma.post.findMany({
    where: {
      OR:[
        {
          title: {
            contains: keyword
          },
          published: true
        },
        {
          body: {
            contains: keyword
          },
          published: true
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
      name: {
        contains: keyword
      }
    }
  })
  return usersWithFilter;
}

const comments: IFieldResolver<EmptyParent, ContextWithRequestResponse, EmptyArgs> = async(parent, args, { prisma }, info)=>{
  const comments = await prisma.comment.findMany();
  return comments;
}

const Query = {
  me, 
  post,
  myPosts,
  posts,
  users,
  comments
 };

 export { Query };