import Limo, {EndpointType, JsxLimo, getEndpoints} from "@limo/lib";
import express, { Express } from "express";
import {addRoute} from "./utils";

export type ExpressAppProps = {
  onStart?: () => void;
  port: number;
  beforeStart?: (instance: Express) => void;
};
export const ExpressApp: JsxLimo<void, ExpressAppProps> = ({
  children,
  onStart,
  port,
  beforeStart,
}) => {
  const endpoints: EndpointType[] = getEndpoints(children);
  const server = express();
  
  for (const endpoint of endpoints) {
    console.log(`Limo: create endpoint ${endpoint.method}: ${endpoint.url}`);
    addRoute(server, endpoint);
  }

  if (beforeStart) {
    beforeStart(server);
  }

  server.listen({ port }, () => {
    if (onStart) {
      onStart();
    }
  });
};
