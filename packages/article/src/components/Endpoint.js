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
