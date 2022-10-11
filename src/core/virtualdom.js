function createVirtualElement(type, props, ...children) {
  return { type, props, children: children.flat() };
}

export default createVirtualElement;
