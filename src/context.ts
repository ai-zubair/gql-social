import { Request } from 'express';
import { ContextCallback } from "graphql-yoga/dist/types";
import { verify } from 'jsonwebtoken';
import { AuthTokenPayload, ClientStore, Context, ContextWithRequestResponse } from "./types/common.type";

export const authenticateUser = (dataStore: ClientStore): string=>{
  const authToken = dataStore["x-auth"];
  if(authToken){
    try{
      const tokenPayload = verify(authToken as string, "serversecretkey") as AuthTokenPayload;
      return tokenPayload.userID;
    }catch(err){
      throw new Error("Authentication Failed!");
    }
  }else{
    throw new Error("Unauthorized Access!");
  }
}

export const getServerContext = (contextWithoutReqRes: Context): ContextCallback => {
  const serverContext: ContextCallback = ({ request, connection}): ContextWithRequestResponse=>{
    const contextWithReqRes: ContextWithRequestResponse = { ...contextWithoutReqRes, request, connection, authenticateUser };
    return contextWithReqRes;
  }
  return serverContext;
};
