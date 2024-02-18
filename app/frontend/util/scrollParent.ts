const scrollParent = (element: HTMLElement, includeHidden = false) => {
  let style = getComputedStyle(element);
  const excludeStaticParent = style.position === 'absolute';
  const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

  if (style.position === 'fixed') return document.body;

  // biome-ignore lint/suspicious/noAssignInExpressions: I know how to use a for loop thanks
  for (let parent = element; (parent = parent.parentElement as HTMLElement); ) {
    style = getComputedStyle(parent);
    if (excludeStaticParent && style.position === 'static') {
      continue;
    }
    if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
  }

  return document.body;
};

export default scrollParent;
