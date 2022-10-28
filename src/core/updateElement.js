import createRealElement from './createRealElement';

export function updateElement({ parentNode, newNode, oldNode, index = 0 }) {
  // 인자들은 실제 element가 아닌 virtual dom이다.
  console.log(parentNode);
  if (!newNode && oldNode)
    return parentNode.removeChild(parentNode.childNodes[index]);

  if (newNode && !oldNode) {
    return parentNode.appendChild(createRealElement(newNode));
  }

  if (typeof newNode === 'string' && typeof oldNode === 'string') {
    if (newNode === oldNode) return;
    return parentNode.replaceChild(
      createRealElement(newNode),
      parentNode.childNodes[index],
    );
  }

  if (newNode.type !== oldNode.type) {
    return parentNode.replaceChild(
      createRealElement(newNode),
      parentNode.childNodes[index],
    );
  }

  if (parentNode) {
    updateAttributes({
      target: parentNode.childNodes[index],
      newProps: newNode.props || {},
      oldProps: oldNode.props || {},
    });
  }

  const maxLength = Math.max(newNode.children.length, oldNode.children.length);

  for (let i = 0; i < maxLength; i++) {
    if (parentNode) {
      updateElement({
        parentNode: parentNode.childNodes[index],
        newNode: newNode.children[i],
        oldNode: oldNode.children[i],
      });
    }
  }
}

function updateAttributes({ target, newProps, oldProps }) {
  for (const [attr, value] of Object.entries(newProps)) {
    if (oldProps[attr] === newProps[attr]) continue;
    target.setAttribute(attr, value);
  }
  for (const attr of Object.keys(oldProps)) {
    if (newProps[attr] !== undefined) continue;
    target.removeAttribute(attr);
  }
}
