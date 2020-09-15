import { Database } from "../db";
import { PubSub } from 'graphql-subscriptions';

export interface EmptyArgs{

}

export interface EmptyParent{
  
}

export interface Context {
  pubSub: PubSub,
  db: Database
}