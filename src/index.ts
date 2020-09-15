import { GraphQLServer } from 'graphql-yoga';
import { PubSub } from 'graphql-subscriptions';
import { db } from './db';
import { Query } from './resolvers/Query/Query.res';
import { Mutation } from './resolvers/Mutation/Mutation.res';
import { Subscription } from './resolvers/Subscription/Subscription.res';
import { User } from './resolvers/User/User.res';
import { Post } from './resolvers/Post/Post.res';  
import { Comment } from './resolvers/Comment/Comment.res';

const pubSub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    Post,
    User,
    Comment 
  },
  context: {
    db,
    pubSub
  }
})
server.start({ port: 2020 },()=>{
  console.log("Server is fired up at localhost:2020 ");
})