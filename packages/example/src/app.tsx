import {Get, Limo, Router} from "@limo/lib";
import {UserRouter} from "./routers/UsersRouter";
import {TestRouter} from "./routers/TestsRouter";
import {FastifyServerOptions} from "fastify";
import { FastifyApp } from "@limo/fastify-adapter";

export const App = () => {
  const port = 3000;
  const options: FastifyServerOptions = {
    logger: false,
  };
  const onStart = () => console.log(`App started on port ${port}`);

  return (
    <FastifyApp onStart={onStart} port={port} fastifyOptions={options}>
      <UserRouter />
      <TestRouter />
      <Router path="/rand">
        <Get>
          {async () => ({ hello: true })}
        </Get>
      </Router>
    </FastifyApp>
  )
};
