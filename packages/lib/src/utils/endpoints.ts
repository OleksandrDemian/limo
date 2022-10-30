import {LimoNode} from "../types/jsx";
import {EndpointType} from "../types/endpoints";
import {Router} from "../components/Router";

export const getEndpoints = (nodes: LimoNode[]): EndpointType[] => {
  const endpoints: EndpointType[] = [];
  
  for (const child of nodes) {
    // todo: fix type
    let r: any;
    // @ts-ignore
    if (child.fn === Router) {
      r = child;
    } else {
      r = child.fn({
        ...child.props,
        children: child.children,
      }) as any;
    }
    
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