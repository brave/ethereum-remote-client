import React, { Component } from 'react';
import { HashRouter, Route, Router } from 'react-router-dom';

export default class DebugRouter extends HashRouter {
  debugHistory = (location, action) => {
    console.log('[debug-router]', 'current url:',
      `${location.pathname}${location.search}${location.hash}`
    )
    console.log('[debug-router]', 'last navigation action:', action,
                JSON.stringify(this.history, null, 2));
  }

  constructor(props) {
    super(props);

    //console.log('[debug-router]', 'initial history is: ', JSON.stringify(this.history, null,2))
    //this.history.listen(this.debugHistory);
  }
}
