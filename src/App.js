import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import Mousetrap from 'mousetrap';

import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';

import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      code: localStorage.code || 'g.Vertex().Limit(1).All();',
      result: '',
      showSidebar: true,
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

  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  }

  onAppRef = el => {
    const mousetrap = new Mousetrap(el);
    mousetrap.bind('ctrl+enter', this.runCode);
  }

  render() {
    const editorOptions = {
      height: '100%',
      width: '100%',
      theme: 'solarized_dark',
      highlightActiveLine: false,
      showPrintMargin: false,
      fontSize: '16px',
      tabSize: 2,
      editorProps: {
        $blockScrolling: true
      }
    }

    return (
      <div className="App" ref={this.onAppRef}>
        <div className={`App__sidebar ${this.state.showSidebar ? '' : 'App__sidebar--collapsed' }`}>
          <div className="App__sidebar__title" onClick={this.toggleSidebar}>
            ARTHUR
            <div className="App__sidebar__close-button">
              ‹
            </div>
          </div>
        </div>

        <div className="App__pane-container">
          <div className="App__pane App__pane--code">
            <AceEditor
              { ...editorOptions }
              mode="javascript"
              onChange={this.updateCode}
              name="App__pane__code-1"
              value={this.state.code}
            />

            <div className="App__pane__run-button" onClick={this.runCode}>
              ►
            </div>
          </div>

          <div className="App__pane-divider" />

          <div className="App__pane App__pane--results">
            <AceEditor
              { ...editorOptions }
              mode="json"
              readOnly={true}
              name="App__pane__code-2"
              value={this.state.result}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default App;
