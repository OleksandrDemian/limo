import {Limo} from "../Limo";
import {EndpointType} from "../types/endpoints";
import {Delete, Endpoint as EndpointComponent, EndpointProps, Get, Patch, Post, Put} from './Endpoint';
import {JsxLimo, LimoNode} from "../types/jsx";

export type RouterProps = {
  path: string;
}

const getEndpoint = (path: string, node: LimoNode<EndpointType, EndpointProps>) => {
  const endpoint = node.fn({
    ...node.props,
    children: node.children,
  });

  if (path) {
    endpoint.url = path + endpoint.url;
  }

  return endpoint;
}

const ENDPOINT_FUNCTIONS = [EndpointComponent, Get, Put, Post, Patch, Delete];

export const Router: JsxLimo<EndpointType[], RouterProps> = ({ children, path }) => {
  const endpoints: EndpointType[] = [];

  for (const child of children) {
    // @ts-ignore
    if (child.fn === Router) {
      // todo nested routers
      const r: any = child;
      endpoints.push(
        ...r.fn({
          ...r.props,
          path: r.props.path ? path + r.props.path : '',
          children: r.children,
        }),
      );
      // @ts-ignore
    } else if (ENDPOINT_FUNCTIONS.indexOf(child.fn) > -1) {
      endpoints.push(getEndpoint(
        path,
        child as LimoNode<EndpointType, EndpointProps>,
      ));
    } else {
      console.warn(`${child.fn} is not supported under Router`);
    }
  }

  return endpoints;
}