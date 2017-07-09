import React, { Component } from 'react';
import Mousetrap from 'mousetrap';

import { Icon } from 'react-mdl';

import './sidebar.css';

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      expanded: false,
    };
  }

  toggle = () => {
    this.setState({ expanded: !this.state.expanded });
  }

  toggleStats = () => {
    this.setState({
      expanded: false,
    });

    // TODO: Route to stats here
  }

  render() {
    return (
      <div className={`app__sidebar ${this.state.expanded ? '' : 'app__sidebar--collapsed' }`}>
        <div className="app__sidebar__title" onClick={this.toggle}>
          ARTHUR
          <div className="app__sidebar__close-button">
            ‹
          </div>
        </div>

        <div className="app__sidebar__menu__option app__sidebar__animated" onClick={this.toggleStats}>
          <Icon name="assessment" /> Stats
        </div>
      </div>
    );
  }
};

export default Sidebar;
