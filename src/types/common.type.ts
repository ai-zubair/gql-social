import { Request } from 'express';
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

export interface ContextWithRequestResponse extends Context{
  request: Request;
}