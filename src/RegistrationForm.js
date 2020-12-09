import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function RegistrationForm(props) {
    const data = props.value;
    //const dataForm = this.props.userDataForm;
    return(
      <form className="userDataForm" onSubmit={props.submit}>
        <label for="name">ФИО</label>
        <input type="text" id="name" name="name"
          value={data.name}
          onChange={props.change}
          placeholder="Иванов Иван Иванович"/>

        <label for="sex">пол</label>
        <select id="sex" name="sex"
        value={data.sex}
        onChange={props.change}>
          <option>мужской</option>
          <option>женский</option>
        </select>

        <label for="date">Дата рождения</label>
        <input type="date" id="date" name="date"
        value={data.date}
        onChange={props.change}
        />

        <label for="address">Адрес</label>
        <input type="text" id="address" name="address"
        value={data.address}
        onChange={props.change}
        />

        <label for="medicine">Номер полиса ОМС</label>
        <input type="text" id="medicine" name="medicine"
          value={data.medicine}
          onChange={props.change}
          placeholder="00000000000"/>

        <input type='submit' value='Сохранить'/>
      </form>
    );
}

export default RegistrationForm;
