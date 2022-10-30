export const start = (app) => {
  const proto = app();
  proto.tagName({
    ...proto.props,
    children: proto.children,
  });
};
