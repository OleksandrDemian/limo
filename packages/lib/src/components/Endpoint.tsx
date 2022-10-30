import {Limo} from "../Limo";
import {HTTPMethod, EndpointType} from "../types/endpoints";
import {JsxLimo, LimoNode} from "../types/jsx";

export type EndpointProps = {
  path?: string;
  method?: HTTPMethod;
};

const getEndpoint = ({ method, path }: EndpointProps, children: LimoNode[]): EndpointType | undefined => {
  if (children.length < 1) {
    console.warn(`No handler detected for endpoint ${method}: ${path}. Only the first one will be used`);
  } else if (children.length > 1) {
    console.warn(`Multiple handlers detected for endpoint ${method}: ${path}. Only the first one will be used`);
    // todo: does chain makes sense?
    // const chain = [];
    // for (const child of children) {
    //   chain.push(getFn(child));
    // }
    // fn = async (res, req) => {
    //   let ret = null;
    //
    //   for (const f of chain) {
    //     ret = await f(res, req, ret);
    //   }
    //
    //   return ret;
    // }
  } else {
    return ({
      method: method,
      url: path || '',
      handler: typeof children[0] === "function" ? children[0] : children[0].fn,
    });
  }
}

export const Endpoint: JsxLimo<EndpointType | undefined, EndpointProps> =
  ({ method = 'GET', path, children }) =>
    getEndpoint({ method, path }, children);

export const Get: JsxLimo<EndpointType | undefined, EndpointProps> = ({ method = 'GET', path, children }) =>
  getEndpoint({ method, path }, children);

export const Post: JsxLimo<EndpointType | undefined, EndpointProps> = ({ method = 'POST', path, children }) =>
  getEndpoint({ method, path }, children);

export const Put: JsxLimo<EndpointType | undefined, EndpointProps> = ({ method = 'PUT', path, children }) =>
  getEndpoint({ method, path }, children);

export const Patch: JsxLimo<EndpointType | undefined, EndpointProps> = ({ method = 'PATCH', path, children }) =>
  getEndpoint({ method, path }, children);

export const Delete: JsxLimo<EndpointType | undefined, EndpointProps> = ({ method = 'DELETE', path, children }) =>
  getEndpoint({ method, path }, children);
