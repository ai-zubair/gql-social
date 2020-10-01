import { PubSub } from 'graphql-subscriptions';
import { PrismaClient } from "@prisma/client";

export interface EmptyArgs{

}

export interface EmptyParent{
  
}

export interface Context {
  pubSub: PubSub,
  prisma: PrismaClient
}