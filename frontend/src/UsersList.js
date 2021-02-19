import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function UsersList(props) {
  const rows = props.rows;
  return(
    <table class="table table-success table-stripedt">
      <thead>
        <tr class="table-light">
          <th class="table-light">№</th>
          <th class="table-light">ФИО</th>
          <th class="table-light">Пол</th>
          <th class="table-light">Дата рождения</th>
          <th class="table-light">Адрес</th>
          <th class="table-light">Номер полиса ОМС</th>
          <th class="table-light">Действие</th>
        </tr>
       </thead>
       <tbody>
        {rows}
      </tbody>
    </table>
 );
};

export default UsersList;
