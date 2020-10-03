import { ContextCallback } from "graphql-yoga/dist/types";
import { Context, ContextWithRequestResponse } from "./types/common.type";

export const getServerContext = (contextWithoutReqRes: Context): ContextCallback => {
  const serverContext: ContextCallback = ({ request }): ContextWithRequestResponse=>{
    const contextWithReqRes: ContextWithRequestResponse = { ...contextWithoutReqRes, request };
    return contextWithReqRes;
  }
  return serverContext;
};
