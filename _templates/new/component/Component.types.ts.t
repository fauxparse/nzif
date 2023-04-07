---
to: app/frontend/<%= h.inflection.pluralize(type) %>/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.types.ts
---
<% Name = h.changeCase.pascal(name) -%>
import { ElementType, ReactElement } from 'react';

import { Polymorphic, WithDisplayName } from '../../types/polymorphic.types';

export type Base<%= Name %>Props = {
  //
};

export type <%= Name %>Props<C extends ElementType = 'div'> = Polymorphic<C, Base<%= Name %>Props>;

export type <%= Name %>Component = WithDisplayName<
  <C extends ElementType = 'div'>(props: <%= Name %>Props<C>) => ReactElement | null
>;
