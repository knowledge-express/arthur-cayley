import React, { Component } from 'react';
import { Observable } from 'rxjs';
import debounceFn from 'debounce-fn';
import henry from 'henry-cayley';
import { Layer, Rect, Stage, Group, Line, Circle } from 'react-konva';
import stringToColor from 'string-to-color';
import './explore.css';

const X_OFFSET = 500;
const Y_OFFSET = 500;
const SIZE_SCALE = .1;

const isIri = maybeIri => /^<.*>$/.test(maybeIri);

console.log(isIri(`Druggability is a term used in drug discovery to describe a biological target (such as a protein) that is known to or is predicted to bind with high affinity to a drug. Furthermore, by definition, the binding of the drug to a druggable target must alter the function of the target with a therapeutic benefit to the patient. The concept of druggability is most often restricted to small molecules (low molecular weight organic substances) but also has been extended to include biologic medical products such as therapeutic monoclonal antibodies.`))

class Explore extends Component {
  constructor() {
    super();
    this.state = {
      code: localStorage.code || 'g.Vertex().Limit(1).All();',
      result: '',
      cayleyURL: 'http://feedbackfruits-knowledge-graph.herokuapp.com',
      limit: 1000,
      nodes: [],
      edges: []
    };

    setTimeout(this.getQuads);
  }

  getQuads = async () => {
    const { cayleyURL, limit, object, predicate, subject } = this.state;

    // const response = await fetch(`${cayleyURL}/gephi/gs?mode=raw&limit=${limit}${object ? `&obj=${encodeURIComponent(object)}` : ''}${subject ? `&sub=${encodeURIComponent(subject)}` : ''}${predicate ? `&pred=${encodeURIComponent(predicate)}` : ''}`);
    // const observable = new Observable(observer => {
    //   const reader = response.body.getReader();
    //
    //   const read = async reader => {
    //     const result = await reader.read();
    //     if (result.done) return observer.complete();
    //     observer.next(result.value);
    //     return read(reader);
    //   };
    //
    //   read(reader);
    // });
    //
    // const decoder = new TextDecoder('utf-8');

    const stream = henry({ host: cayleyURL }).gephi({ limit, object, predicate, subject });

    // observable
    //   .map(uint8array => decoder.decode(uint8array))
    //   .flatMap(string => string.split('\n'))
    //   .scan(({ result, stack }, value) => {
    //     try {
    //       return { result: JSON.parse(stack + value), stack: '' };
    //     } catch (error) {
    //       return { result: null, stack: stack + value };
    //     }
    //   }, { result: null, stack: '' })
    //   .map(({ result }) => result)
    //   .filter(result => !!result)
    stream
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
                const source = nodes[edge.source];
                const target = nodes[edge.target];

                return (
                  <tr key={key}>
                    <td className={`explore__quad-table__cell ${isIri(source.label) ? 'explore__quad-table__cell--iri' : ''}`}>{source.label}</td>
                    <td className={`explore__quad-table__cell ${isIri(edge.label) ? 'explore__quad-table__cell--iri' : ''}`}>{edge.label}</td>
                    <td className={`explore__quad-table__cell ${isIri(target.label) ? 'explore__quad-table__cell--iri' : ''}`}>{target.label}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="app__pane">
        <Stage width={window.innerWidth} height={window.innerHeight} pixelRatio={15}>
          <Layer>
            {Object.entries(this.state.nodes).map(([key, node]) => {
              return <Circle
                key={key}
                x={node.x + X_OFFSET} y={node.y + Y_OFFSET} radius={node.size * SIZE_SCALE}
                fill={`#${stringToColor.generate(node.label)}`}
              />
            })}

            {Object.entries(this.state.edges).map(([key, edge]) => {
              const source = this.state.nodes[edge.source];
              const target = this.state.nodes[edge.target];
              const points = [source.x + X_OFFSET, source.y + Y_OFFSET, target.x + X_OFFSET, target.y + Y_OFFSET];
              console.log(edge, points);
              return <Line
                key={key}
                points={points}
                stroke={`#${stringToColor.generate(edge.pred)}`}
                strokeWidth="1"
              />
            })}
          </Layer>
        </Stage>
        </div>
      </div>
    );
  }
};

export default Explore;
