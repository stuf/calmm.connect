/* eslint-disable no-console */
import { Component } from 'react';
import * as React from 'karet';
import * as P from 'prop-types';
import * as U from 'karet.util';
import * as L from 'partial.lenses';
import * as R from 'ramda';

//# transformTemplate :: (StrMap Any, Atom) ~> StrMap Any
const transformTemplate = (template, store) =>
  L.transform([L.values,
               L.modifyOp(v => U.view(v, store))], template);

//# StoreProvider :: ??? ~> ReactComponent
export class StoreProvider extends Component {
  getChildContext() {
    return { store: this.props.store };
  }

  render() {
    return this.props.children;
  }
}

StoreProvider.childContextTypes = {
  store: P.any,
};

//# extendContext :: (StrMap Any, StrMap Any) ~> StrMap Any
const extendContext = (c1, c2) => {
  const k1 = new Set(Object.keys(c1));
  const k2 = new Set(Object.keys(c2));
  const overlap = new Set([...k1].filter(x => k2.has(x)));

  if (overlap.size > 0) {
    // We have duplicates, warn user as this may have implications
    console.warn('Trying to merge provided context to existing context' +
                 'but there seems to be a conflict. This is probably not' +
                 'intentional and may result in unspecified functionality.\n\n' +
                 `The overlapping properties are: ${Array.from(overlap).join(', ')}`);
  }

  return R.merge(c1, c2);
};

//# withContext :: ReactComponent ~> ReactComponent
function withContext(originalFn) {
  const fn = (props, context) => originalFn(props, context);
  fn.contextTypes = { store: P.any };
  return fn;
}

//# connect :: (StrMap Any, ReactComponent) ~> ReactComponent
export function connect(template, WrappableComponent) {
  const WrappedComponent = withContext((props, ctx) => {
    const tmpl = transformTemplate(template, ctx.store);

    return <WrappableComponent {...R.merge(props, tmpl)} />;
  });

  return WrappedComponent;
}

//# Provider :: { store :: Atom, children :: Any } ~> ReactElement
export function Provider({ store, children }) {
  return (
    <StoreProvider store={store}>
      {children}
    </StoreProvider>
  );
}
