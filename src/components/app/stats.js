import React, { Component } from 'react';
import Mousetrap from 'mousetrap';

import { Icon } from 'react-mdl';

import { Link } from 'react-router-dom'

import './sidebar.css';

class Stats extends Component {
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
      <div>

      </div>
    );
  }
};

export default Stats;
