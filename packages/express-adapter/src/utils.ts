import {Express} from "express";
import {EndpointType} from "@limo/lib";

export const addRoute = (express: Express, endpoint: EndpointType) => {
  const method = endpoint.method.toLowerCase();
  express[method](endpoint.url, endpoint.handler);
};
