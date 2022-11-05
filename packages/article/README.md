# Node server with JSX routing

JSX is an XML-like syntax extension to javascript. It is mainly associated with front-end development since it is used in client-side libraries/frameworks such as [React](https://reactjs.org/) and [Solid](https://www.solidjs.com/), but in reality its potential goes beyond template rendering. JSX is transpiled into pure JavaScript, and what you do with it is up to you.

One of the things you can do with it is to generate endpoints for a backend server.

## Goal
The goal is to have a NodeJs server that will route requests using JSX components like this:
```javascript
/** src/routes/Users.jsx */

const GetUser = async (req) => {
  const id = req.query.id;
  return Promise.resolve({
    id,
    message: `You requested user with id ${id}`,
  });
};

const GetAllUsers = async () => {
  return Promise.resolve({
    message: 'You requested all users',
  });
};

const PostUser = async (req) => {
  const { name, surname } = req.body;
  return Promise.resolve({
    message: `You posted user with name = "${name}" and surname = "${surname}"`,
  });
};

export const UserRouter = () => (
  <Router path="/users">
    <Endpoint method="GET">
      <GetUser />
    </Endpoint>
    <Endpoint method="POST">
      <PostUser />
    </Endpoint>
    <Endpoint method="GET" path="/all">
      <GetAllUsers />
    </Endpoint>
  </Router>
);

/** src/App.jsx */
export const App = () => {
  const port = 3000;
  const options = {
    logger: false,
  };
  
  const onStart = () => console.log(`App started on port ${port}`);
  
  return (
    <FastifyApp
      port={port}
      fastifyOptions={options}
      onStart={onStart}
    >
      <UserRouter/>
    </FastifyApp>
  );
}
```

## Tech
* [esbuild](https://esbuild.github.io/): Transpile JSX and bundle server code
* [fastify](https://www.fastify.io/): Fast and low overhead web framework for Node.js

## Overview
To achieve the goal, the JSX code should be transpiled into plain Javascript, which can be executed by `node`. You can use any transpiler you want, in this tutorial I will go with `esbuild`, since it is simple to use and set up. We will also have to provide a custom jsx processor, which in our case will be a simple function that returns the parameters, the logic will be implemented in the components themselves.

## Entities (base components)
From the above code we can already identify the following entities:
* FastifyApp: a component that will instantiate the Fastify server and assign routes
* Router: a component that will process its children and return a list of endpoints to the FastifyApp
* Endpoint: a component containing endpoint description (method, path) and will return a handler

## Setup
For this project to run you will have to install the following dependencies (you don't necessary have to use the same versions):
* esbuild (v`^0.15.12`)
* fastify (v`^4.9.2`)

## Custom processor and start function
* CustomJsxProcessor: this function will be used to replace JSX elements. It is the same as React.createElement and should be imported in all jsx files (no auto-import in this tutorial).
* start: this function will start the app

```javascript
/* src/CustomJsxProcessor.js */
function CustomJsxProcessor(tagName, props, ...children) {
  return {
    fn: tagName,// since we have no string tags here (all components are functions), we will rename tagName to fn
    props,
    children,
  };
}

export function start (app) {
  const proto = app();
  proto.fn({
    ...proto.props,
    children: proto.children,
  });
}

export default CustomJsxProcessor;
```

## Base components
Note that base components (Endpoint, Router, and FastifyApp) won't return JSX as you do with client-side libraries, instead, they will return javascript objects that can be used by Fastify.

Base components **will be executed at start time (once)** to create routes and cannot be modified at runtime (as oposed to React where components are executed every time).

### Endpoint
```javascript
/* src/components/Endpoint.js */

/**
 * Process endpoint
 * For simplicity, only the first child will be used as handler
 */
const getEndpoint = ({ method, path }, children) => {
  if (children.length < 1) {
    console.warn(`No handler detected for endpoint ${method}: ${path}`);
  } else {
    if (children.length > 1) {
      console.warn(`Multiple handlers detected for endpoint ${method}: ${path}. Only the first one will be used`);
    }

    return ({
      method: method,
      url: path || '',
      handler: typeof children[0] === "function" ? children[0] : children[0].fn,
    });
  }
}

export const Endpoint = ({ method = 'GET', path, children }) => getEndpoint({ method, path }, children);
```

### Router
```javascript
/* src/components/Router.js */

import {Endpoint} from "./Endpoint";

/**
 * process Endpoint component.
 * This will take in input a JSX component and return javascript endpoint object
 * <Endpoint path="/users" method="GET">{handler}</Endpoint> -> ({
 *   path: '/users',
 *   method: 'GET',
 *   handler: (req, res) => { ... },
 * })
 */
const getEndpoint = (path, node) => {
  // path -> router path. Endpoint will use it as prefix for nesting
  // node -> a JSX element (<Endpoint ... />)

  // execute endpoint function to get endpoint info (method, url, handler)
  const endpoint = node.fn({
    ...node.props,
    children: node.children,
  });

  // prefix endpoint path with router path
  if (path) {
    endpoint.url = path + endpoint.url;
  }

  return endpoint;
};

export const Router = ({ children, path }) => {
  const endpoints = [];

  for (const child of children) {
    if (child.fn === Router) {
      // a child can be a nested router, execute it and get all of its endpoints as nested paths
      const r = child;
      endpoints.push(
        ...r.fn({
          ...r.props,
          path: r.props.path ? path + r.props.path : '',
          children: r.children,
        }),
      );
    } else if (Endpoint === child.fn) {
      // a child is endpoint, process it and add it to the endpoints list
      endpoints.push(getEndpoint(
        path,
        child,
      ));
    } else {
      console.warn(`${child.fn} is not supported under Router`);
    }
  }

  return endpoints;
}
```

### FastifyApp
```javascript
/* src/components/Router.js */

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
```

## App
Now that we have all the base components we can start implementing the application.

### Users router
```javascript
/* src/routes/Users.jsx */

/* ! REMEMBER TO IMPORT JSX FACTORY (CustomJsxProcessor) */
import CustomJsxProcessor from "../CustomJsxProcessor";
import {Router} from "../components/Router";
import {Endpoint} from "../components/Endpoint";

const GetUser = async (req) => {
  const id = req.query.id;
  return Promise.resolve({
    id,
    message: `You requested user with id ${id}`,
  });
};

const GetAllUsers = async () => {
  return Promise.resolve({
    message: 'You requested all users',
  });
};

const PostUser = async (req) => {
  const { name, surname } = req.body;
  return Promise.resolve({
    message: `You posted user with name = "${name}" and surname = "${surname}"`,
  });
};

const NestedGet = async () => Promise.resolve({
  message: `This endpoint is nested`,
});

export const UserRouter = () => (
  <Router path="/users">
    <Endpoint method="GET">
      <GetUser />
    </Endpoint>
    <Endpoint method="POST">
      <PostUser />
    </Endpoint>
    <Endpoint method="GET" path="/all">
      <GetAllUsers />
    </Endpoint>
    
    {/* Nested routing, will inherit /users */}
    {/* Current implementation does not allow nested component routers */}
    <Router path="/nested">
      <Endpoint method="GET">
        <NestedGet />
      </Endpoint>
      <Endpoint method="GET" path="/no-component-example">
        {async (req, res) => {
          // you can use handlers without components
          const date = Date.now();
          return Promise.resolve({
            message: `This handler does not have component`,
            timestamp: date,
          });
        }}
      </Endpoint>
    </Router>
  </Router>
);
```

### Instantiate app with Fastify
```javascript
/* src/App.jsx */

import CustomJsxProcessor from "./CustomJsxProcessor";
import {UserRouter} from "./routes/Users";
import {FastifyApp} from "./components/FastifyApp";

export const App = () => {
  const port = 3000;
  // fastify options
  const options = {
    logger: false,
  };
  
  const onStart = () => console.log(`App started on port ${port}`);
  
  return (
    <FastifyApp
      port={port}
      fastifyOptions={options}
      onStart={onStart}
    >
      <UserRouter/>
    </FastifyApp>
  );
}
```

### Entry point to start the server
```javascript
/* src/server.js */

import {App} from "./App";
import { start } from "./CustomJsxProcessor";

start(App);
```

## Run the server
Now that all the components are in place, and App is implemented, the only remaining thing is to run it. We will need to bundle the app using `esbuild` and execute the bundle with node.

### bundle script
```javascript
/* scripts/index.js */

#!/usr/bin/env node
const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ["src/server.js"],
  bundle: true,
  outfile: "build/server.js",
  jsxFactory: 'CustomJsxProcessor',
  jsx: 'transform',
  platform: 'node',
}).catch(() => process.exit(1));
```

### script command
To run the app execute the following command:
```shell
node scripts/index.js && node ./build/server.js
```

### package.json
Just for reference, the package.json looks like this:
```json
{
  "name": "jsx-server-routing-with-fastify",
  "version": "0.0.0",
  "scripts": {
    "start:article": "node scripts/index.js && node ./build/server.js"
  },
  "dependencies": {
    "fastify": "^4.9.2",
    "esbuild": "^0.15.12"
  }
}
```

You can find the code [here](https://github.com/OleksandrDemian/limo/tree/master/packages/article).