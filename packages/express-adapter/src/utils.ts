import {Express, Request, Response} from "express";
import {EndpointType} from "@limo/lib";

export const addRoute = (express: Express, endpoint: EndpointType) => {
  const method = endpoint.method.toLowerCase();
  express[method](endpoint.url, async (req: Request, res: Response) => {
    const data = await endpoint.handler(req, res);
    res.status(200).send(data);
  });
};
