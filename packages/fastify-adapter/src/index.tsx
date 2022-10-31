import Limo, {EndpointType, JsxLimo, getEndpoints} from "@limo/lib";
import fastify, {FastifyInstance, FastifyServerOptions} from "fastify";

export type FastifyAppProps = {
  onStart?: () => void;
  port: number;
  fastifyOptions?: FastifyServerOptions;
  beforeStart?: (instance: FastifyInstance) => void;
};
export const FastifyApp: JsxLimo<void, FastifyAppProps> = ({
  children,
  onStart,
  port,
  fastifyOptions,
  beforeStart,
}) => {
  const endpoints: EndpointType[] = getEndpoints(children);
  const server = fastify(fastifyOptions);
  
  for (const endpoint of endpoints) {
    console.log(`Limo: create endpoint ${endpoint.method}: ${endpoint.url}`);
    server.route({
      method: endpoint.method,
      url: endpoint.url,
      handler: endpoint.handler,
    });
  }

  if (beforeStart) {
    beforeStart(server);
  }

  server.listen({ port }).then(() => {
    if (onStart) {
      onStart();
    }
  });
};
