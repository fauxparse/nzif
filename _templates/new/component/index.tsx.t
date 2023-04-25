---
to: app/frontend/<%= h.inflection.pluralize(type) %>/<%= h.changeCase.pascal(name) %>/index.tsx
---
<% Name = h.changeCase.pascal(name) -%>
import <%= Name %> from './<%= Name %>';
import { <%= Name %>Props } from './<%= Name %>.types';

export type { <%= Name %>Props };

export default <%= Name %>;
