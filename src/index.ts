import { GraphQLServer } from 'graphql-yoga';
import { db } from './db';
import { Query } from './resolvers/Query.res';
import { Mutation } from './resolvers/Mutation.res';
import { User } from './resolvers/User.res';
import { Post } from './resolvers/Post.res';  
import { Comment } from './resolvers/Comment.res';

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Post,
    User,
    Comment 
  },
  context: {
    db
  }
})

server.start({ port: 2020 },()=>{
  console.log("Server is fired up at localhost:2020 ");
})