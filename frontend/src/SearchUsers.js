import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function SearchUsers(props) {
  const value = props.value;
  const change = props.change;
  return(
    <form>
      <div class="mb-3">
        <label class="form-label" for="search">Поиск:</label>
        <input class="form-control" type="text" id="search" name="search"
          value={value}
          onChange={change}
        />
    </div>
    </form>
 );
};

export default SearchUsers;
