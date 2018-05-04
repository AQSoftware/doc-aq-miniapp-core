// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

const MINIAPP_URL = 'http://localhost:3000';
// const MINIAPP_URL = 'about:blank';

ReactDOM.render(
  <App targetUrl={MINIAPP_URL}/>,
  document.getElementById('root')
);
