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
