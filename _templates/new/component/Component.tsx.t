---
to: app/frontend/<%= h.inflection.pluralize(type) %>/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.tsx
---
<% Name = h.changeCase.pascal(name) -%>
import React, { ElementType, forwardRef } from 'react';
import clsx from 'clsx';

import { <%= Name %>Component } from './<%= Name %>.types';

import './<%= Name %>.css';

export const <%= Name %>: <%= Name %>Component = forwardRef(({ as, className, ...props }, ref) => {
  const Component = (as || 'div') as ElementType;

  return (
    <Component
      ref={ref}
      className={clsx('<%= h.changeCase.snake(name).replace(/_/g, '-') %>', className)}
      {...props}
    />
  );
});

<%= Name %>.displayName = '<%= Name %>';

export default <%= Name %>;
