import { $, addClass, removeClass, hasClass, toggleClass, attr, removeAttr, transform, transition, on, off, trigger, transitionEnd, outerWidth, outerHeight, styles, offset, css, each, html, text, is, index, eq, append, prepend, next, nextAll, prev, prevAll, parent, parents, closest, find, children, filter, remove } from '/static/html/components/auction-details/modules/dom7/dom7.esm.js';
const Methods = {
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  attr,
  removeAttr,
  transform,
  transition,
  on,
  off,
  trigger,
  transitionEnd,
  outerWidth,
  outerHeight,
  styles,
  offset,
  css,
  each,
  html,
  text,
  is,
  index,
  eq,
  append,
  prepend,
  next,
  nextAll,
  prev,
  prevAll,
  parent,
  parents,
  closest,
  find,
  children,
  filter,
  remove
};
Object.keys(Methods).forEach(methodName => {
  Object.defineProperty($.fn, methodName, {
    value: Methods[methodName],
    writable: true
  });
});
export default $;