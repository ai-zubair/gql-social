import { GraphQLServer } from 'graphql-yoga';
import { PubSub } from 'graphql-subscriptions';
import { PrismaClient } from '@prisma/client';
import { Query } from './resolvers/Query/Query.res';
import { Mutation } from './resolvers/Mutation/Mutation.res';
import { Subscription } from './resolvers/Subscription/Subscription.res';
import { User } from './resolvers/User/User.res';
import { Post } from './resolvers/Post/Post.res';
import { Comment } from './resolvers/Comment/Comment.res';
import { getServerContext } from './context';

const pubSub = new PubSub();
const prisma = new PrismaClient();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: getServerContext({pubSub, prisma})
})
server.start({ port: 2020 },()=>{
  console.log("Server is fired up at localhost:2020 ");
})