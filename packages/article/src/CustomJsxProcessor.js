function CustomJsxProcessor(tagName, props, ...children) {
  return {
    fn: tagName,
    props,
    children,
  };
}

export function start (app) {
  const proto = app();
  proto.fn({
    ...proto.props,
    children: proto.children,
  });
}

export default CustomJsxProcessor;