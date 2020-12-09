import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function SearchUsers(props) {
  const value = props.value;
  const change = props.change;
  return(
    <form>
      <label for="search">Поиск</label>
      <input type="text" id="search" name="search"
        value={value}
        onChange={change}
      />
    </form>
 );
};

export default SearchUsers;
