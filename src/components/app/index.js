import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import Mousetrap from 'mousetrap';

import { Icon } from 'react-mdl';

import { Route } from 'react-router-dom'

import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';

import Sidebar from './sidebar';

import './index.css';

import Editor from './editor';
import Explore from './explore';
import Stats from './stats';

class App extends Component {
  constructor() {
    super();
    this.state = {
      code: localStorage.code || 'g.Vertex().Limit(1).All();',
      result: '',
      cayleyURL: 'http://staging-fbf-cayley.herokuapp.com'
    };
  }

  updateCode = newCode => {
    this.setState({ code: newCode });
    localStorage.code = newCode;
  }

  runCode = () => {
    fetch(`${this.state.cayleyURL}/api/v1/query/gizmo`, {
      method: 'POST',
      body: this.state.code
    }).then(response => response.json()).then(result => {
      this.setState({ result: JSON.stringify(result, null, 2) });
    });
  }

  onAppRef = el => {
    const mousetrap = new Mousetrap(el);
    mousetrap.bind('ctrl+enter', this.runCode);
  }

  render() {
    return (
      <div className="app" ref={this.onAppRef}>
        <Sidebar />

        <Route exact path="/" component={Editor} />
        <Route exact path="/explore" component={Explore} />
        <Route exact path="/stats" component={Stats} />

      </div>
    );
  }
};

export default App;
