import React, { Component } from 'react';
import brace from 'brace';
import AceEditor from 'react-ace';
import Mousetrap from 'mousetrap';

import 'brace/mode/javascript';
import 'brace/mode/json';
import 'brace/theme/solarized_dark';

import './index.css';

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
      <div className="app" ref={this.onAppRef}>
        <div className={`app__sidebar ${this.state.showSidebar ? '' : 'app__sidebar--collapsed' }`}>
          <div className="app__sidebar__title" onClick={this.toggleSidebar}>
            ARTHUR
            <div className="app__sidebar__close-button">
              ‹
            </div>
          </div>
        </div>

        <div className="app__pane-container">
          <div className="app__pane app__pane--code">
            <AceEditor
              { ...editorOptions }
              mode="javascript"
              onChange={this.updateCode}
              name="app__pane__code-1"
              value={this.state.code}
            />

            <div className="app__pane__run-button" onClick={this.runCode}>
              ►
            </div>
          </div>

          <div className="app__pane-divider" />

          <div className="app__pane app__pane--results">
            <AceEditor
              { ...editorOptions }
              mode="json"
              readOnly={true}
              name="app__pane__code-2"
              value={this.state.result}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default App;
