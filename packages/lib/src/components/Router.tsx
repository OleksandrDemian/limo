import { Limo } from "../lib/processor";
import {EndpointType} from "../types/endpoints";
import { Endpoint as EndpointComponent } from './Endpoint';

const getEndpoint = (path: string, node: JSX.Element): EndpointType | undefined => {
  let endpointPath = node.props.path;
  if (path) {
    endpointPath = path + endpointPath;
  }
  
  if (endpointPath.endsWith("/")) {
    endpointPath = endpointPath.substring(0, endpointPath.length - 1);
  }
  
  return node.tagName({
    ...node.props,
    children: node.children,
    path: endpointPath,
  }) as EndpointType | undefined;
}

export type RouterProps = {
  children?: JSX.Element[];
  path: string;
}
export const Router = ({ children, path }: RouterProps) => {
  const endpoints: EndpointType[] = [];

  for (const child of children) {
    if (child.tagName === Router) {
      // todo nested routers
    } else if (child.tagName === EndpointComponent) {
      const endpoint = getEndpoint(path, child);
      if (endpoint) {
        endpoints.push(endpoint);
      }
    } else {
      console.warn(`${child.tagName} is not supported under Router`);
    }
  }

  return endpoints;
}