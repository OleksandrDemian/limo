import {Limo, Router, EndpointType} from "@limo/lib";
import fastify, {FastifyServerOptions} from "fastify";

export type FastifyAppProps = {
  children?: JSX.Element[];
  onStart?: () => void;
  port: number;
  fastifyOptions?: FastifyServerOptions;
};
export const FastifyApp = ({ children, onStart, port, fastifyOptions }: FastifyAppProps) => {
  const endpoints: EndpointType[] = [];
  const server = fastify(fastifyOptions);

  for (const child of children) {
    const r = child.tagName();
    if (r.tagName === Router) {
      endpoints.push(
        ...r.tagName({ ...r.props, children: r.children }),
      );
    }
  }
  
  for (const endpoint of endpoints) {
    console.log(`Create endpoint ${endpoint.method}: ${endpoint.url}`);
    server.route({
      method: endpoint.method,
      url: endpoint.url,
      handler: endpoint.handler,
    });
  }
  
  server.listen({ port }).then(() => {
    if (onStart) {
      onStart();
    }
  });

  return server;
};
