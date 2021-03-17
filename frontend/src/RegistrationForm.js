import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
function RegistrationForm(props) {
    const data = props.value;

    return(
      <form onSubmit={props.submit}>
        <div class="mb-3">
          <label class="form-label" for="name">ФИО</label>
          <input class="form-control" type="text" id="name" name="name"
              value={data.name}
              onChange={props.change}
              placeholder="Иванов Иван Иванович"
          />
        <p class="errors">{data.invalidInformation.name}</p>
        </div>

        <div class="mb-3">
          <label class="form-label" for="sex">Пол</label>
          <select class="form-control" id="sex" name="sex"
              value={data.sex}
              onChange={props.change}>
                <option>m</option>
                <option>f</option>
           </select>
           <p class="errors">{data.invalidInformation.gender}</p>
          </div>

          <div class="mb-3">
            <label class="form-label" for="date">Дата рождения</label>
            <input class="form-control" type="date" id="date" name="date"
              value={data.date}
              onChange={props.change}
            />
           <p class="errors">{data.invalidInformation.birth_date}</p>
          </div>

          <div class="mb-3">
            <label class="form-label" for="address">Адрес</label>
            <input class="form-control" type="text" id="address" name="address"
              value={data.address}
              onChange={props.change}
            />
           <p class="errors">{data.invalidInformation.living_address}</p>
          </div>

          <div class="mb-3">
            <label class="form-label" for="medicine">Номер полиса ОМС</label>
            <input class="form-control" type="text" id="medicine" name="medicine"
                value={data.medicine}
                onChange={props.change}
                placeholder="00000000000"
             />
            <p class="errors">{data.invalidInformation.insurance_policy}</p>
          </div>

          <input class="btn btn-light" type='submit' value='Сохранить'/>
      </form>
    );
}

export default RegistrationForm;
