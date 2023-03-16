export const makeDOMwithProperties = (domType, propertyMap) => { // TS의 필요성
  const dom = document.createElement(domType);
  Object.keys(propertyMap).map((key) => {
    dom[key] = propertyMap[key];
  });
  return dom;
}

export const appendChildrenList = (target, childrenList) => {
  // childrenList가 배열일 지 아닐 지 모름 -> 타입스크립트 필요
  if (!Array.isArray(childrenList)) return;

  childrenList.forEach((children) => {
    if(!children) return; // 추가
    target.appendChild(children);
  })
};
