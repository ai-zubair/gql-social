import { GraphQLServer } from 'graphql-yoga';
import { db, Database } from './db';
import { Query } from './resolvers/Query/Query.res';
import { Mutation } from './resolvers/Mutation/Mutation.res';
import { User } from './resolvers/User/User.res';
import { Post } from './resolvers/Post/Post.res';  
import { Comment } from './resolvers/Comment/Comment.res';

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