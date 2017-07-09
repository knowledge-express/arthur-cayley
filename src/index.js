import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

import 'react-mdl/extra/material.css';
import 'react-mdl/extra/material.js';

import { BrowserRouter } from 'react-router-dom'

ReactDOM.render((
<BrowserRouter>
  <App />
</BrowserRouter>
), document.getElementById('root'));

registerServiceWorker();
