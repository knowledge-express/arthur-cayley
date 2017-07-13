import React, { Component } from 'react';
import { Observable } from 'rxjs';
import debounceFn from 'debounce-fn';

import './explore.css';

class Explore extends Component {
  constructor() {
    super();
    this.state = {
      code: localStorage.code || 'g.Vertex().Limit(1).All();',
      result: '',
      cayleyURL: 'http://localhost:64210',
      limit: 1000,
      nodes: [],
      edges: []
    };

    setTimeout(this.getQuads);
  }

  getQuads = async () => {
    const { cayleyURL, limit, object, predicate, subject } = this.state;

    const response = await fetch(`${cayleyURL}/gephi/gs?mode=raw&limit=${limit}${object ? `&obj=${encodeURIComponent(object)}` : ''}${subject ? `&sub=${encodeURIComponent(subject)}` : ''}${predicate ? `&pred=${encodeURIComponent(predicate)}` : ''}`);
    const observable = new Observable(observer => {
      const reader = response.body.getReader();

      const read = async reader => {
        const result = await reader.read();
        if (result.done) return observer.complete();
        observer.next(result.value);
        return read(reader);
      };

      read(reader);
    });

    const decoder = new TextDecoder('utf-8');

    observable
      .map(uint8array => decoder.decode(uint8array))
      .flatMap(string => string.split('\n'))
      .scan(({ result, stack }, value) => {
        try {
          return { result: JSON.parse(stack + value), stack: '' };
        } catch (error) {
          return { result: null, stack: stack + value };
        }
      }, { result: null, stack: '' })
      .map(({ result }) => result)
      .filter(result => !!result)
      .bufferTime(1000)
      .scan(({ nodes, edges }, entries) => {
        return entries.reduce(({ nodes, edges}, { ae, an, ce, cn, de, dn }) => {
          if (ae) return { nodes, edges: Object.assign(edges, ae) };
          if (ce) return { nodes, edges: Object.assign(edges, ce) };
          if (an) return { edges, nodes: Object.assign(nodes, an) };
          if (cn) return { edges, nodes: Object.assign(nodes, cn) };
          return { nodes, edges };
        }, { nodes: { ...nodes }, edges: { ...edges } });
      }, { nodes: [], edges: [] })
      // .sampleTime(100)
      .subscribe(({ nodes, edges }) => {
        this.setState({ nodes, edges })
      });
  }

  onChangeObject = debounceFn(() => {
    this.setState({ object: this.objectInput.value });
    this.getQuads();
  }, { wait: 500 });

  onChangePredicate = debounceFn(() => {
    this.setState({ predicate: this.predicateInput.value });
    this.getQuads();
  }, { wait: 500 });

  onChangeSubject = debounceFn(() => {
    this.setState({ subject: this.subjectInput.value });
    this.getQuads();
  }, { wait: 500 });

  render() {
    const { nodes, edges } = this.state;

    return (
      <div className="app__pane-container">
        <div className="app__pane">
          <table className="explore__quad-table">
            <thead>
              <tr>
                <th>Subject</th>
                <th>Predicate</th>
                <th>Object</th>
              </tr>
              <tr>
                <th><input type="text" ref={input => this.subjectInput = input} onChange={this.onChangeSubject}/></th>
                <th><input type="text" ref={input => this.predicateInput = input} onChange={this.onChangePredicate}/></th>
                <th><input type="text" ref={input => this.objectInput = input} onChange={this.onChangeObject}/></th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(edges).map(([key, edge]) => {
                return (
                  <tr key={key}>
                    <td>{nodes[edge.source].label}</td>
                    <td>{edge.label}</td>
                    <td>{nodes[edge.target].label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
};

export default Explore;
