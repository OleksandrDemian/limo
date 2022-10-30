import {LimoNode} from "./types/jsx";

export const start = (app: () => LimoNode) => {
  const proto = app();
  proto.fn({
    ...proto.props,
    children: proto.children,
  });
};
