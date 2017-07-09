import React, { Component } from 'react';
import Mousetrap from 'mousetrap';

import { Icon } from 'react-mdl';

import { Link } from 'react-router-dom'


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

        <Link to="/stats" className="app__sidebar__menu__option app__sidebar__animated">
          <Icon name="assessment" />Stats
        </Link>
      </div>
    );
  }
};

export default Sidebar;
