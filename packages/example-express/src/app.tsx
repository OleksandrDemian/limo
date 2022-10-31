import {Get, Limo, Router} from "@limo/lib";
import {UserRouter} from "./routers/UsersRouter";
import {TestRouter} from "./routers/TestsRouter";
import { ExpressApp } from "@limo/express-adapter";
import { Express } from 'express';

export const App = () => {
  const port = 3000;

  const onStart = () => console.log(`App started on port ${port}`);
  const beforeStart = (instance: Express) => {
    instance.use((req, res, next) => {
      // todo: doesn't work
      console.log('Interceptor');
      next();
    });
  };

  return (
    <ExpressApp
      port={port}
      onStart={onStart}
      beforeStart={beforeStart}
    >
      <UserRouter />
      <TestRouter />
      <Router path="/rand">
        <Get>
          {async () => ({ hello: true })}
        </Get>
      </Router>
    </ExpressApp>
  )
};
