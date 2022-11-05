import fastify from "fastify";
import { Router } from "./Router";

/**
 * Process Router children and return list of endpoints
 */
export const getEndpoints = (nodes) => {
  const endpoints = [];
  
  for (const child of nodes) {
    let r;
    /**
     * A child can be Router or a component returning a Router.
     * In the latest case, we should execute the function to get the Router
     */
    if (child.fn === Router) {
      // child is a Router
      r = child;
    } else {
      // child is a Component, execute it, since it may return a Router
      r = child.fn({
        ...child.props,
        children: child.children,
      });
    }

    // if `r` is router, get endpoints
    if (r.fn === Router) {
      endpoints.push(
        ...r.fn({
          ...r.props,
          children: r.children,
        }),
      );
    }
  }
  
  return endpoints;
};

export const FastifyApp = ({
  children,
  onStart,
  port,
  fastifyOptions,
}) => {
  const endpoints = getEndpoints(children);
  // create fastify server
  const server = fastify(fastifyOptions);
  
  // assign endpoints
  for (const endpoint of endpoints) {
    console.log(`Create endpoint ${endpoint.method}: ${endpoint.url}`);
    server.route({
      method: endpoint.method,
      url: endpoint.url,
      handler: endpoint.handler,
    });
  }

  // start server
  server.listen({ port }).then(() => {
    if (onStart) {
      onStart();
    }
  });
};
