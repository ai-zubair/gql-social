import { Request } from 'express';
import { ContextCallback } from "graphql-yoga/dist/types";
import { verify } from 'jsonwebtoken';
import { AuthTokenPayload, Context, ContextWithRequestResponse } from "./types/common.type";

export const authenticateUser = (request: Request): string=>{
  const authToken = request.headers["x-auth"];
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
  const serverContext: ContextCallback = ({ request }): ContextWithRequestResponse=>{
    const contextWithReqRes: ContextWithRequestResponse = { ...contextWithoutReqRes, request, authenticateUser };
    return contextWithReqRes;
  }
  return serverContext;
};
