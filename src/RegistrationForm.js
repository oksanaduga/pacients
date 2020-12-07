import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function RegistrationForm(props) {
  return (
    <form className="userDataForm" onSubmit={props.handleSubmit}>
      <label for="name">ФИО</label>
      <input type="text" id="name" name="name" placeholder="Иванов Иван Иванович"/>

      <label for="male">пол</label>
      <select id="male" name="male">
        <option>мужской</option>
        <option>женский</option>
      </select>

      <label for="date">Дата рождения</label>
      <input type="date" id="date" name="date"/>

      <label for="adress">Адрес</label>
      <input type="text" id="adress" name="adress"/>

      <label for="medicine">Номер полиса ОМС</label>
      <input type="text" id="medicine" name="medicine" placeholder="00000000000"/>

      <input type='submit' value='Сохранить'/>
    </form>
  );
}

export default RegistrationForm;
