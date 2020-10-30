import { Request } from 'express';
import { PubSub } from 'graphql-subscriptions';
import { ExecutionParams } from 'subscriptions-transport-ws';
import { IncomingHttpHeaders } from 'http';
import { PrismaClient } from "@prisma/client";

export interface EmptyArgs{

}

export interface EmptyParent{
  
}

export interface Context {
  pubSub: PubSub;
  prisma: PrismaClient;
}

export interface ContextWithRequestResponse extends Context{
  request: Request;
  connection: ExecutionParams;
  authenticateUser(dataStore: ClientStore): string;
  serverSecret: string;
}

export interface ClientStore extends IncomingHttpHeaders{
  "x-auth": string;
}

export interface AuthTokenPayload {
  userID: string;
}
