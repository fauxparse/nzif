---
to: app/frontend/<%= h.inflection.pluralize(type) %>/<%= h.changeCase.pascal(name) %>/<%= h.changeCase.pascal(name) %>.css
---
:where(.<%= h.changeCase.snake(name).replace(/_/g, '-') %>) {
  /* CSS declarations */
}
