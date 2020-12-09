import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function UsersList(props) {
  const rows = props.rows;
  return(
    <table>
      <thead>
        <tr>
          <th>№</th>
          <th>ФИО</th>
          <th>Пол</th>
          <th>Дата рождения</th>
          <th>Адрес</th>
          <th>Номер полиса ОМС</th>
          <th>Действие</th>
        </tr>
       </thead>
       <tbody>
        {rows}
      </tbody>
    </table>
 );
};

export default UsersList;
