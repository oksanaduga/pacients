import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class UserList extends React.Component {
  render() {
    return (
      <button
        className="square"
        onClick={() => this.props.onClick()}
      >
        {this.props.value}
      </button>
    );
  }
}

export default UserList;
