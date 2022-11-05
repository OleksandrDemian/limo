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
      // ! current implementation does not support nested Component routers
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