import {LimoNode} from "./types/jsx";

export function Limo(tagName, props, ...children): LimoNode {
  return {
    fn: tagName,
    props,
    children,
  };
}
