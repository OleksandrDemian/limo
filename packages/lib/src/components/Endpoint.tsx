import {HTTPMethod, EndpointType} from "../types/endpoints";

const getFn = (node: JSX.Element) => {
  let fn = undefined;
  if (typeof node === "function") {
    fn = node;
  }

  if (typeof node !== "function" && typeof node.tagName === "function") {
    fn = node.tagName;
  }
  
  return fn;
}

export type EndpointProps = {
  path: string;
  method?: HTTPMethod;
  children?: ((req: any, res: any) => any)[];
};
export const Endpoint = ({ method = 'GET', path, children }: EndpointProps): EndpointType | undefined => {
  let fn = null;
  if (children.length === 1) {
    fn = getFn(children[0]);
  } else if (children.length > 1) {
    console.warn(`Multiple functions detected for endpoint ${method}: ${path}. Only the first one will be used`);
    fn = getFn(children[0]);
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
  }

  if (fn == null) {
    return undefined;
  }

  return {
    method,
    url: path,
    handler: fn,
  }
}
